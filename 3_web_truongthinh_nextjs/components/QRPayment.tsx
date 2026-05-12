"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle, Copy, Check, AlertCircle, ExternalLink, RefreshCw, Shield } from "lucide-react";

// ══════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════

export interface PayOSPayload {
  checkoutUrl:   string;
  qrCode:        string;   // Raw EMVCo QR string — rendered by qrserver API
  orderCode:     string;
  amount:        number;
  accountName:   string;   // e.g. "TRUONG THINH TRANSPORT"
  accountNumber: string;   // e.g. "0989292578"
  bankName:      string;   // e.g. "MB Bank"
  bin?:          string;   // Bank BIN for VietQR: "970422" = MB
}

type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";

interface QRPaymentProps {
  payload:        PayOSPayload;
  customerName:   string;
  phone:          string;
  seats:          string[];
  route:          { origin: string; destination: string; date: string };
  onBack:         () => void;
  onConfirmed:    () => void;
}

// ══════════════════════════════════════════════════════════════
//  MOCK: PayOS payment creation
//  Replace with real POST /api/payments/create in production
// ══════════════════════════════════════════════════════════════
export async function createMockPayOSPayment(
  amount: number,
  description: string
): Promise<PayOSPayload> {
  const orderCode = `TT${Date.now().toString().slice(-8)}`;
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));
  return {
    checkoutUrl:   `https://pay.payos.vn/web/${orderCode}`,
    qrCode:        `00020101021238540010A000000727012400069704220113${
      "0989292578".padStart(13, "0")
    }0208QRIBFTTA5303704540${amount}5802VN6215${orderCode}6304ABCD`,
    orderCode,
    amount,
    accountName:   "TRUONG THINH TRANSPORT",
    accountNumber: "0989 292 578",
    bankName:      "MB Bank",
    bin:           "970422",
  };
}

// ══════════════════════════════════════════════════════════════
//  MOCK: Payment status polling
//  Replace body with real GET /api/payments/status/{orderCode}
//
//  Simulates SUCCESS randomly after ~10 seconds of polling
//  so the auto-transition flow can be tested locally.
// ══════════════════════════════════════════════════════════════
const pollStartRef = { current: 0 };

async function checkPaymentStatus(
  orderCode: string
): Promise<PaymentStatus> {
  // ── Real implementation (uncomment when backend is ready) ──
  // const res = await fetch(`/api/payments/status/${orderCode}`);
  // const data = await res.json();
  // return data.status as PaymentStatus;

  // ── Mock: succeed after ~10 s ──
  const elapsed = Date.now() - pollStartRef.current;
  if (elapsed > 10_000 && Math.random() > 0.45) {
    return "SUCCESS";
  }
  return "PENDING";
}

// ══════════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════

function CopyBtn({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all duration-200
        ${copied
          ? "bg-green-100 text-green-600"
          : "bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20"
        }`}
      title={`Sao chép ${label ?? value}`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Đã chép!" : "Sao chép"}
    </button>
  );
}

function InfoRow({
  label,
  value,
  highlight = false,
  copyable  = false,
}: {
  label: string; value: string;
  highlight?: boolean; copyable?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-white/10 last:border-0">
      <span className="text-white/50 text-xs font-medium flex-shrink-0 w-28">{label}</span>
      <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
        <span className={`text-sm font-bold text-right break-all leading-tight
          ${highlight ? "text-brand-gold text-base" : "text-white"}`}>
          {value}
        </span>
        {copyable && <CopyBtn value={value} label={label} />}
      </div>
    </div>
  );
}

/** Animated scanning-line overlay on QR */
function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
      <div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-blue to-transparent opacity-70"
        style={{ animation: "scanLine 2.5s ease-in-out infinite" }}
      />
      <style>{`
        @keyframes scanLine {
          0%   { top: 8%;  }
          50%  { top: 88%; }
          100% { top: 8%;  }
        }
      `}</style>
    </div>
  );
}

/** MoMo-style QR corner brackets */
function QRCorners() {
  const cls = "absolute w-6 h-6 border-brand-blue border-[3px]";
  return (
    <>
      <div className={`${cls} top-0 left-0 border-r-0 border-b-0 rounded-tl-lg`} />
      <div className={`${cls} top-0 right-0 border-l-0 border-b-0 rounded-tr-lg`} />
      <div className={`${cls} bottom-0 left-0 border-r-0 border-t-0 rounded-bl-lg`} />
      <div className={`${cls} bottom-0 right-0 border-l-0 border-t-0 rounded-br-lg`} />
    </>
  );
}

// ══════════════════════════════════════════════════════════════
//  SUCCESS SCREEN
// ══════════════════════════════════════════════════════════════
function SuccessScreen({
  customerName, phone, seats, route, amount, orderCode, onConfirmed,
}: {
  customerName: string; phone: string; seats: string[];
  route: { origin: string; destination: string; date: string };
  amount: number; orderCode: string; onConfirmed: () => void;
}) {
  const formatVnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

  return (
    <div className="bg-white rounded-3xl border border-brand-border shadow-card overflow-hidden animate-scale-in">
      {/* Green success header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
        </div>
        <h3 className="text-white font-extrabold text-lg">Thanh toán thành công!</h3>
        <p className="text-white/80 text-sm mt-1">Vé của bạn đã được xác nhận tự động</p>
      </div>

      <div className="p-6">
        {/* Ticket card */}
        <div className="bg-gradient-to-br from-brand-blue to-brand-blue-dark rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
              🎫 Vé Điện Tử
            </span>
            <span className="text-white/50 text-[10px] font-mono">#{orderCode}</span>
          </div>

          <p className="text-white font-extrabold text-xl mb-1">
            {route.origin}
            <span className="text-brand-gold mx-2">→</span>
            {route.destination}
          </p>
          <p className="text-white/60 text-sm">📅 {route.date}</p>
          <p className="text-white/60 text-sm">💺 Ghế: {seats.join(", ")}</p>
          <p className="text-white/60 text-sm">👤 {customerName}</p>
          <p className="text-white/60 text-sm">📞 {phone}</p>

          <div className="border-t border-white/20 mt-4 pt-4 flex justify-between items-center">
            <span className="text-white/60 text-sm">Đã thanh toán:</span>
            <span className="text-brand-gold font-extrabold text-xl">{formatVnd(amount)}</span>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5 flex gap-2">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-green-700 leading-relaxed">
            Nhân viên sẽ gọi xác nhận lịch khởi hành qua{" "}
            <strong>{phone}</strong>. Vui lòng kiểm tra điện thoại trong vòng 30 phút.
          </p>
        </div>

        <button
          onClick={onConfirmed}
          className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3.5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-card text-sm"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function QRPayment({
  payload,
  customerName,
  phone,
  seats,
  route,
  onBack,
  onConfirmed,
}: QRPaymentProps) {
  const TIMEOUT_SECS   = 15 * 60; // 15 minutes
  const POLL_INTERVAL  = 3_000;   // 3 seconds

  const [status, setStatus]       = useState<PaymentStatus>("PENDING");
  const [countdown, setCountdown] = useState(TIMEOUT_SECS);
  const [pollCount, setPollCount] = useState(0);
  const pollRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isStopped = status !== "PENDING";

  const formatVnd = (n: number) => n.toLocaleString("vi-VN") + "đ";
  const mmss = `${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`;

  // Build VietQR image URL using MBBank BIN
  const qrImageUrl =
    `https://img.vietqr.io/image/${payload.bin ?? "970422"}-${
      payload.accountNumber.replace(/\s/g, "")
    }-compact2.png?amount=${payload.amount}&addInfo=${
      encodeURIComponent(payload.orderCode)
    }&accountName=${encodeURIComponent(payload.accountName)}`;

  // Fallback QR using qrserver if VietQR fails
  const fallbackQR =
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${
      encodeURIComponent(payload.qrCode)
    }&bgcolor=ffffff&color=1565C0&margin=4`;

  // ── Countdown timer ──
  useEffect(() => {
    if (isStopped) return;
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setStatus("EXPIRED");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [isStopped]);

  // ── Auto-polling every 3 seconds ──
  const runPoll = useCallback(async () => {
    if (isStopped) return;
    const result = await checkPaymentStatus(payload.orderCode);
    setPollCount((c) => c + 1);
    if (result === "SUCCESS") {
      setStatus("SUCCESS");
      clearInterval(pollRef.current!);
      clearInterval(timerRef.current!);
    } else if (result === "FAILED") {
      setStatus("FAILED");
      clearInterval(pollRef.current!);
    }
  }, [isStopped, payload.orderCode]);

  useEffect(() => {
    // Mark poll start time for the mock timer
    pollStartRef.current = Date.now();
    pollRef.current = setInterval(runPoll, POLL_INTERVAL);
    return () => {
      clearInterval(pollRef.current!);
      clearInterval(timerRef.current!);
    };
  }, [runPoll]);

  // ── SUCCESS → auto-transition ──
  if (status === "SUCCESS") {
    return (
      <SuccessScreen
        customerName={customerName}
        phone={phone}
        seats={seats}
        route={route}
        amount={payload.amount}
        orderCode={payload.orderCode}
        onConfirmed={onConfirmed}
      />
    );
  }

  // ── EXPIRED / FAILED ──
  if (status === "EXPIRED" || status === "FAILED") {
    return (
      <div className="bg-white rounded-3xl border border-brand-border shadow-card overflow-hidden animate-scale-in text-center">
        <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-8">
          <AlertCircle className="w-14 h-14 text-white mx-auto mb-3" />
          <h3 className="text-white font-extrabold text-lg">
            {status === "EXPIRED" ? "Giao dịch hết hạn" : "Giao dịch thất bại"}
          </h3>
          <p className="text-white/70 text-sm mt-1">
            {status === "EXPIRED"
              ? "Quá 15 phút chưa nhận được thanh toán."
              : "Giao dịch bị từ chối bởi ngân hàng."}
          </p>
        </div>
        <div className="p-6 space-y-3">
          <button
            onClick={onBack}
            className="w-full bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-3.5 rounded-2xl transition-all hover:-translate-y-0.5 text-sm"
          >
            ← Quay lại và thử lại
          </button>
          <a href="tel:19005445"
            className="block w-full border border-brand-border text-brand-muted font-semibold py-3 rounded-2xl hover:bg-gray-50 transition-all text-sm">
            📞 Liên hệ hỗ trợ: 1900 54 54 45
          </a>
        </div>
      </div>
    );
  }

  // ── PENDING (main payment screen) ──
  return (
    <div className="bg-[#0D1B35] rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">

      {/* ── Top header: PayOS branding ── */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* PayOS logo mark */}
          <div className="w-8 h-8 rounded-lg bg-[#00C9A7] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-[11px]">P</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">PayOS</p>
            <p className="text-white/40 text-[10px]">Cổng thanh toán tự động</p>
          </div>
        </div>

        {/* Countdown */}
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border transition-colors ${
          countdown < 60
            ? "bg-red-500/20 border-red-500/30"
            : "bg-white/10 border-white/20"
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${countdown < 60 ? "bg-red-400 animate-pulse" : "bg-green-400 animate-pulse"}`} />
          <span className={`font-mono font-bold text-sm tabular-nums ${countdown < 60 ? "text-red-400" : "text-white"}`}>
            {mmss}
          </span>
        </div>
      </div>

      {/* ── Route + amount banner ── */}
      <div className="mx-4 mb-4 bg-white/8 rounded-2xl px-4 py-3 border border-white/10">
        <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-1">
          Thanh toán cho
        </p>
        <p className="text-white font-bold text-base">
          {route.origin}
          <span className="text-[#00C9A7] mx-2">→</span>
          {route.destination}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-white/50 text-xs">💺 {seats.join(", ")} · {route.date}</p>
          <p className="text-[#00C9A7] font-extrabold text-lg">{formatVnd(payload.amount)}</p>
        </div>
      </div>

      {/* ── QR Code section ── */}
      <div className="flex flex-col items-center px-5 pb-2">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">
          Quét mã QR để thanh toán
        </p>

        {/* QR wrapper with VNPay-style corner brackets */}
        <div className="relative p-3 bg-white rounded-2xl shadow-[0_0_0_4px_rgba(0,201,167,0.2)]">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrImageUrl}
              alt="PayOS QR Code"
              width={210}
              height={210}
              className="rounded-xl block"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackQR;
              }}
            />
            <ScanLine />
            <QRCorners />
          </div>
        </div>

        {/* Bank logo strip */}
        <div className="flex items-center gap-2 mt-4 bg-white/8 border border-white/10 rounded-full px-4 py-2">
          <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center">
            <span className="text-white text-[8px] font-black">MB</span>
          </div>
          <span className="text-white/70 text-xs font-semibold">{payload.bankName}</span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-white/70 text-xs">{payload.accountNumber}</span>
        </div>

        {/* Polling status indicator */}
        <div className="flex items-center gap-1.5 mt-3">
          <RefreshCw className={`w-3 h-3 text-white/30 ${!isStopped ? "animate-spin" : ""}`} />
          <span className="text-white/30 text-[10px]">
            Đang kiểm tra thanh toán... ({pollCount} lần)
          </span>
        </div>
      </div>

      {/* ── Transfer details ── */}
      <div className="mx-4 mt-4 mb-1 bg-white/8 rounded-2xl border border-white/10 px-4 py-1">
        <InfoRow label="Ngân hàng"      value={payload.bankName}       />
        <InfoRow label="Số tài khoản"   value={payload.accountNumber}  copyable />
        <InfoRow label="Chủ tài khoản"  value={payload.accountName}    />
        <InfoRow label="Số tiền"        value={formatVnd(payload.amount)} highlight copyable />
        <InfoRow label="Nội dung CK"    value={payload.orderCode}      copyable />
      </div>

      {/* ── Warning notice ── */}
      <div className="mx-4 mt-3 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3 flex gap-2.5">
        <span className="text-amber-400 flex-shrink-0 mt-0.5 text-sm">⚠️</span>
        <p className="text-amber-200/70 text-[11px] leading-relaxed">
          Nhập đúng nội dung chuyển khoản{" "}
          <strong className="text-amber-300">{payload.orderCode}</strong>.
          {" "}Thanh toán sẽ được xác nhận <strong>tự động</strong> trong vài giây.
        </p>
      </div>

      {/* ── Action row ── */}
      <div className="px-4 py-5 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-white/15 text-white/60 font-semibold py-3 rounded-2xl hover:bg-white/5 transition-all text-sm"
        >
          ← Quay lại
        </button>
        <a
          href={payload.checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#00C9A7] hover:bg-[#00b599] text-white font-bold py-3 rounded-2xl transition-all hover:-translate-y-0.5 text-sm"
        >
          Mở PayOS
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Security badge */}
      <div className="flex items-center justify-center gap-1.5 pb-4">
        <Shield className="w-3.5 h-3.5 text-white/25" />
        <span className="text-white/25 text-[10px]">
          Giao dịch được bảo mật bởi PayOS · 256-bit SSL
        </span>
      </div>
    </div>
  );
}
