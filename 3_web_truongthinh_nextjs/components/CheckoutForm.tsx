"use client";

import { useState } from "react";
import { User, Phone, MapPin, CreditCard, Camera } from "lucide-react";
import CCCDScannerModal from "./CCCDScannerModal";

interface CheckoutFormProps {
  selectedSeats: string[];
  route: { origin: string; destination: string; price: number; date: string };
  onBack: () => void;
  /** Called when user submits — passes name & phone up to parent for QR screen */
  onSuccess: (name: string, phone: string) => void;
}

const INPUT_CLS =
  "w-full border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-text placeholder-brand-subtle bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all duration-200";

const PICKUP_POINTS = [
  "Bến xe Miền Đông (Sài Gòn)",
  "Bến xe Quy Nhơn – 70 Lạc Long Quân, Phú Tài",
  "VP Trường Thịnh – 70 Lạc Long Quân, Quy Nhơn",
  "Đón tại nhà (phụ thu 30.000đ – 80.000đ)",
];

export default function CheckoutForm({
  selectedSeats,
  route,
  onBack,
  onSuccess,
}: CheckoutFormProps) {
  const [name, setName]     = useState("");
  const [phone, setPhone]   = useState("");
  const [pickup, setPickup] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const totalPrice = selectedSeats.length * route.price;
  const formatVnd  = (n: number) => n.toLocaleString("vi-VN") + "đ";

  const handleCCCDDataExtracted = (data: {
    name: string;
    cccd: string;
    address: string;
  }) => {
    setName(data.name);
    setIsScannerOpen(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-brand-border shadow-card overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark px-5 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm uppercase tracking-wider leading-tight">
            Thông tin đặt vé
          </p>
          <p className="text-white/60 text-[11px]">Bước 2/3 — Điền thông tin</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* ── Order summary card ── */}
        <div className="bg-gradient-to-br from-brand-bg to-blue-50/40 rounded-2xl p-4 mb-5 border border-brand-border">
          <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest mb-3">
            📋 Tóm tắt đơn
          </p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-brand-muted">Tuyến:</span>
            <span className="font-semibold text-right text-brand-text">
              {route.origin} → {route.destination}
            </span>

            <span className="text-brand-muted">Ngày đi:</span>
            <span className="font-semibold text-right">{route.date || "—"}</span>

            <span className="text-brand-muted">Chỗ đã chọn:</span>
            <span className="font-semibold text-brand-blue text-right">
              {selectedSeats.join(", ") || "—"}
            </span>

            <span className="text-brand-muted">Đơn giá:</span>
            <span className="font-semibold text-right">{formatVnd(route.price)}/vé</span>
          </div>

          <div className="border-t border-brand-border mt-3 pt-3 flex justify-between items-center">
            <span className="font-bold text-brand-text text-sm">Tổng cộng:</span>
            <span className="font-extrabold text-brand-red text-xl">
              {formatVnd(totalPrice)}
            </span>
          </div>
        </div>

        {/* ── Customer info form ── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess(name, phone);
          }}
          className="space-y-4"
        >
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-brand-text mb-2">
              <User className="w-3.5 h-3.5 text-brand-blue" />
              Họ và tên <span className="text-brand-red">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                required
                className={INPUT_CLS}
              />
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 shadow-lg hover:-translate-y-0.5"
                title="Quét CCCD để tự động điền tên"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Quét CCCD</span>
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-brand-text mb-2">
              <Phone className="w-3.5 h-3.5 text-brand-blue" />
              Số điện thoại <span className="text-brand-red">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xx xxx xxx"
              required
              pattern="[0-9]{9,11}"
              className={INPUT_CLS}
            />
            <p className="text-xs text-brand-subtle mt-1.5 ml-1">
              Nhân viên sẽ gọi xác nhận vé qua số này.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-brand-text mb-2">
              <MapPin className="w-3.5 h-3.5 text-brand-blue" />
              Điểm đón <span className="text-brand-red">*</span>
            </label>
            <select
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              required
              className={INPUT_CLS + " appearance-none cursor-pointer"}
            >
              <option value="">— Chọn điểm đón —</option>
              {PICKUP_POINTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 border border-brand-border text-brand-muted font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm"
            >
              ← Chọn lại chỗ
            </button>
            <button
              type="submit"
              className="flex-1 bg-brand-gold hover:bg-brand-gold-dark text-white font-bold py-3.5 rounded-xl shadow-gold transition-all duration-200 hover:-translate-y-0.5 text-sm"
            >
              Tiếp tục thanh toán →
            </button>
          </div>
        </form>
      </div>

      {/* ── CCCD Scanner Modal ── */}
      <CCCDScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onDataExtracted={handleCCCDDataExtracted}
      />
    </div>
  );
}
