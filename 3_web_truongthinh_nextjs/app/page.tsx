"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RouteCard, { RouteCardProps } from "@/components/RouteCard";
import SeatSelection from "@/components/SeatSelection";
import CheckoutForm from "@/components/CheckoutForm";
import QRPayment, { PayOSPayload, createMockPayOSPayment } from "@/components/QRPayment";
import {
  Bus, ShieldCheck, Wifi, Snowflake, Clock,
  Phone, Mail, MapPin, Facebook, Send, Loader2,
} from "lucide-react";

// ── Route mock data (from screenshots: Quy Nhơn ⇌ various) ──
const ROUTES: RouteCardProps[] = [
  { origin: "Quy Nhơn", destination: "Huế",        busType: "xe 44 giường",             price: 260000 },
  { origin: "Quy Nhơn", destination: "Huế",        busType: "xe 34 phòng",              price: 290000 },
  { origin: "Quy Nhơn", destination: "Huế",        busType: "xe 22 và 24 phòng",        price: 420000 },
  { origin: "Quy Nhơn", destination: "Vinh",       busType: "xe giường 44 và 34 phòng", price: 540000 },
  { origin: "Quy Nhơn", destination: "Vinh",       busType: "xe 22 và 24 phòng",        price: 720000 },
  { origin: "Quy Nhơn", destination: "Thanh Hóa",  busType: "xe giường 44",             price: 600000 },
  { origin: "Quy Nhơn", destination: "Thanh Hóa",  busType: "xe 22 và 24 phòng",        price: 780000 },
  { origin: "Quy Nhơn", destination: "Hà Nội",     busType: "xe giường 44 và 34 phòng", price: 640000 },
  { origin: "Quy Nhơn", destination: "Hà Nội",     busType: "xe 22 phòng và 24 phòng",  price: 820000 },
  { origin: "Sài Gòn",  destination: "Quy Nhơn",   busType: "xe 34 giường",             price: 260000 },
  { origin: "Sài Gòn",  destination: "Đà Lạt",     busType: "xe 44 giường",             price: 170000 },
  { origin: "Sài Gòn",  destination: "Nha Trang",   busType: "xe 34 phòng VIP",          price: 210000 },
];

const REGULATIONS = [
  "Chấp hành hướng dẫn của lái xe, nhân viên phục vụ trên xe về các quy định bảo đảm trật tự, an toàn giao thông.",
  "Xuất trình vé, xác nhận vé và ngồi đúng chỗ ngồi trên vé. Lưu giữ vé để xuất trình khi người có thẩm quyền kiểm tra.",
  "Không gây mất trật tự trên xe.",
  "Không mang hóa chất độc hại, chất dễ cháy, nổ, hàng nguy hiểm hoặc hàng cấm lưu thông trên xe khách.",
  "Không đu, bám vào thành xe; đứng, ngồi, nằm trên mui xe, nóc xe; tự ý mở cửa xe khi xe đang chạy.",
];

const AMENITIES = [
  { icon: <Wifi className="w-5 h-5" />,        label: "WiFi miễn phí" },
  { icon: <Snowflake className="w-5 h-5" />,   label: "Điều hòa" },
  { icon: <Clock className="w-5 h-5" />,       label: "Đúng giờ" },
  { icon: <ShieldCheck className="w-5 h-5" />, label: "An toàn" },
  { icon: <Bus className="w-5 h-5" />,         label: "Xe mới 2024" },
];

// ── Booking flow: 4 steps ──
type BookingStep = "browse" | "seat" | "checkout" | "payment";

// ══════════════════════════════════════════════════════════════
//  TYPE SYSTEM — Custom DOM Event from AI Chat Widget
//
//  The external widget dispatches:
//    window.dispatchEvent(new CustomEvent('TICKET_BOT_ACTION', {
//      detail: {
//        action:      'OPEN_SEAT_MAP',   // required discriminant
//        trip_id:     'trip-abc-123',
//        origin:      'Quy Nhơn',
//        destination: 'Hà Nội',
//        time:        '07:00',
//        price:       640000,
//        date:        '12/05/2026',      // optional
//      }
//    }))
// ══════════════════════════════════════════════════════════════

/** Payload shape sent by the AutoTicket AI chat widget */
interface TicketBotPayload {
  action:       "OPEN_SEAT_MAP" | string;  // discriminant
  trip_id:      string;
  origin:       string;
  destination:  string;
  time:         string;
  price:        number;
  date?:        string;
}

/**
 * Strongly-typed CustomEvent wrapper so TypeScript knows exactly
 * what detail looks like — eliminates all 'any' linting errors.
 */
type TicketBotEvent = CustomEvent<TicketBotPayload>;

// ── Step progress indicator ──
function StepBar({ current }: { current: BookingStep }) {
  const steps = [
    { id: "seat",     label: "Chọn chỗ" },
    { id: "checkout", label: "Thông tin" },
    { id: "payment",  label: "Thanh toán" },
  ];
  const idx = steps.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-300 ${
            i <= idx
              ? "bg-brand-blue text-white shadow-md"
              : "bg-white border border-brand-border text-brand-muted"
          }`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              i < idx ? "bg-white/30" : ""
            }`}>
              {i < idx ? "✓" : i + 1}
            </span>
            {step.label}
          </div>
          {i < steps.length - 1 && (
            <div className={`w-6 h-px transition-all duration-300 ${i < idx ? "bg-brand-blue" : "bg-brand-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [step, setStep]                   = useState<BookingStep>("browse");
  const [selectedSeats, setSeats]         = useState<string[]>([]);
  const [customerName, setCustomerName]   = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [payosPayload, setPayosPayload]   = useState<PayOSPayload | null>(null);
  const [creatingPayment, setCreating]    = useState(false);
  const [contactForm, setContactForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [aiToast, setAiToast]             = useState<string | null>(null);

  // ── Active route (populated by AI event or manual selection) ──
  const [activeRoute, setActiveRoute] = useState({
    origin:      "Quy Nhơn",
    destination: "Hà Nội",
    price:       640000,
    date:        new Date().toLocaleDateString("vi-VN"),
  });

  /**
   * ════════════════════════════════════════════════════════════
   * CHAT-TO-PAY EVENT BRIDGE
   * ────────────────────────────────────────────────────────────
   * Listens on window for 'TICKET_BOT_ACTION' events fired by
   * the external AutoTicket AI chat widget (loaded via next/script
   * in layout.tsx).
   *
   * Flow when AI finds a trip:
   *   1. Widget dispatches CustomEvent<TicketBotPayload>
   *   2. Bridge validates action === 'OPEN_SEAT_MAP'
   *   3. Updates activeRoute state with AI-provided trip data
   *   4. Shows a brief toast notification ("AI đã tìm được chuyến!")
   *   5. Smoothly scrolls to top (window.scrollTo) so the user
   *      sees the booking UI slide in from a clean state
   *   6. After 350ms (scroll settles), transitions to 'seat' step
   * ════════════════════════════════════════════════════════════
   */
  const handleTicketBotAction = useCallback(
    (rawEvent: Event) => {
      // Cast to our strict typed wrapper — safe because we guard below
      const e       = rawEvent as TicketBotEvent;
      const payload = e.detail;

      // Guard 1: must be the correct action discriminant
      if (payload?.action !== "OPEN_SEAT_MAP") {
        console.warn("[AutoTicket] Unknown action:", payload?.action);
        return;
      }

      // Guard 2: price is required to build the route
      if (!payload.price || payload.price <= 0) {
        console.error("[AutoTicket] Invalid price in payload", payload);
        return;
      }

      // 1. Update route from AI data
      setActiveRoute({
        origin:      payload.origin      || "Quy Nhơn",
        destination: payload.destination || "Hà Nội",
        price:       payload.price,
        date:        payload.date        || new Date().toLocaleDateString("vi-VN"),
      });

      // 2. Show toast so user sees AI triggered the booking
      const toastMsg = `AI tìm được chuyến ${payload.origin} → ${payload.destination} lúc ${
        payload.time
      } · ${payload.price.toLocaleString("vi-VN")}đ`;
      setAiToast(toastMsg);
      setTimeout(() => setAiToast(null), 4500);

      // 3. Scroll to absolute top — user sees booking UI enter cleanly
      window.scrollTo({ top: 0, behavior: "smooth" });

      // 4. Transition after scroll settles (350ms)
      setTimeout(() => setStep("seat"), 350);

      console.info("[AutoTicket] TICKET_BOT_ACTION received:", payload);
    },
    [] // no dependencies — uses only stable React setter refs
  );

  useEffect(() => {
    window.addEventListener("TICKET_BOT_ACTION", handleTicketBotAction);
    return () =>
      window.removeEventListener("TICKET_BOT_ACTION", handleTicketBotAction);
  }, [handleTicketBotAction]);


  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Đã gửi tin nhắn!\nChúng tôi sẽ phản hồi sớm nhất có thể.`);
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  // ── Booking flow panel (steps 2-4) ──
  const isInFlow = step !== "browse";

  return (
    <main className="min-h-screen bg-brand-bg">
      <Header />

      {/*
        ── AI Toast Notification ──────────────────────────────────
        Appears at top-center when the chat widget triggers
        the booking flow. Auto-dismisses after 4.5 seconds.
        Positioned fixed so it's visible regardless of scroll.
        ─────────────────────────────────────────────────────────
      */}
      {aiToast && (
        <div
          className="
            fixed top-20 left-1/2 -translate-x-1/2 z-[60]
            max-w-sm w-[calc(100%-2rem)]
            bg-gradient-to-r from-[#0D1B35] to-brand-blue
            border border-[#00C9A7]/30
            text-white text-sm font-medium
            px-5 py-3.5 rounded-2xl
            shadow-[0_8px_32px_rgba(13,27,53,0.5)]
            flex items-start gap-3
            animate-fade-in-up
          "
          role="status"
          aria-live="polite"
        >
          <span className="text-[#00C9A7] text-base flex-shrink-0 mt-0.5">🤖</span>
          <div className="min-w-0">
            <p className="font-bold text-[#00C9A7] text-xs uppercase tracking-wider mb-0.5">
              AutoTicket AI
            </p>
            <p className="text-white/90 leading-snug text-xs">{aiToast}</p>
          </div>
          {/* Auto-dismiss progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00C9A7]/20 rounded-b-2xl overflow-hidden">
            <div
              className="h-full bg-[#00C9A7]"
              style={{ animation: "shrink 4.5s linear forwards" }}
            />
          </div>
        </div>
      )}
      <style>{`@keyframes shrink { from { width: 100% } to { width: 0% } }`}</style>

      {/* ══ BROWSE / LANDING ══ */}
      {!isInFlow && (
        <>
          <HeroSection />

          {/* Amenity strip */}
          <div className="bg-brand-blue py-5">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex flex-wrap justify-center sm:justify-between gap-4">
                {AMENITIES.map((a) => (
                  <div key={a.label} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                    <span className="text-brand-gold">{a.icon}</span>
                    <span className="text-sm font-medium">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ Route table (matches screenshots) ══ */}
          <section id="tuyen-duong" className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
            <div className="flex items-center gap-3 mb-1">
              <Bus className="w-6 h-6 text-brand-blue" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text">
                Tuyến chạy và Giá vé
              </h2>
            </div>
            <div className="border-b-2 border-brand-border mb-6 w-2/3" />

            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_auto_1fr_1fr_auto] gap-4 px-6 py-2.5 text-[11px] text-brand-muted font-bold uppercase tracking-wider bg-brand-bg border border-brand-border rounded-t-xl">
              <span>Điểm đi</span>
              <span />
              <span>Điểm đến</span>
              <span>Loại xe</span>
              <span className="text-right">Giá vé</span>
            </div>
            <div className="border border-brand-border rounded-xl sm:rounded-t-none overflow-hidden shadow-card">
              {ROUTES.map((route, idx) => (
                <RouteCard key={idx} {...route} isEven={idx % 2 === 0} />
              ))}
            </div>

            {/* Demo trigger */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setStep("seat");
                  setTimeout(() => {
                    document.getElementById("booking-flow")?.scrollIntoView({ behavior: "smooth" });
                  }, 50);
                }}
                className="bg-brand-gold hover:bg-brand-gold-dark text-white font-bold px-10 py-3.5 rounded-full shadow-gold transition-all duration-200 hover:-translate-y-0.5 text-sm"
              >
                🎫 Đặt vé ngay
              </button>
            </div>
          </section>

          {/* ══ Regulations section (from screenshot) ══ */}
          <section id="quy-dinh" className="max-w-5xl mx-auto px-4 sm:px-6 pb-14">
            <div className="bg-white rounded-2xl border border-brand-border shadow-card p-6 sm:p-8 grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text mb-1 flex items-center gap-2">
                  👆 Quy định khi đi xe
                </h2>
                <div className="border-b-2 border-brand-border mb-5 w-32" />
                <ul className="space-y-3">
                  {REGULATIONS.map((reg, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-brand-muted leading-relaxed">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✅</span>
                      {reg}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-40 h-40 sm:w-48 sm:h-48 bg-brand-bg rounded-2xl border border-brand-border flex items-center justify-center text-7xl">
                  📋
                </div>
              </div>
            </div>
          </section>

          {/* ══ Contact section (from screenshot 5) ══ */}
          <section id="contact" className="max-w-5xl mx-auto px-4 sm:px-6 pb-14">
            <div className="section-title justify-center mb-8">LIÊN HỆ</div>

            <div className="grid sm:grid-cols-2 gap-8 bg-white rounded-2xl border border-brand-border shadow-card p-6 sm:p-8">
              {/* Left: contact info */}
              <div className="space-y-5">
                <p className="text-brand-text font-semibold text-sm leading-relaxed">
                  Quý khách có nhu cầu đi lại, gửi hàng hoá vui lòng liên hệ theo thông tin sau
                </p>

                <div>
                  <p className="text-xs text-brand-muted font-bold uppercase tracking-wider mb-1.5">
                    Tổng đài đặt vé:
                  </p>
                  <a href="tel:19005445" className="text-brand-red font-bold hover:underline">
                    1900.54.54.45
                  </a>
                  {" – "}
                  <a href="tel:0984432222" className="text-brand-red font-bold hover:underline">
                    098.443.2222
                  </a>
                </div>

                <div>
                  <p className="text-xs text-brand-muted font-bold uppercase tracking-wider mb-1.5">
                    Tổng đài gửi hàng:
                  </p>
                  <a href="tel:19005555" className="text-brand-red font-bold hover:underline">
                    1900.55.55.44
                  </a>
                  {" – "}
                  <a href="tel:0888024024" className="text-brand-red font-bold hover:underline">
                    0888.024.024
                  </a>
                  {" – "}
                  <a href="tel:0935286222" className="text-brand-red font-bold hover:underline">
                    0935.286.222
                  </a>
                </div>

                <div className="flex items-center gap-2 text-sm text-brand-muted">
                  <Mail className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  <a href="mailto:xetruongthinh@gmail.com" className="text-brand-blue hover:underline">
                    xetruongthinh@gmail.com
                  </a>
                </div>

                <div className="flex items-start gap-2 text-sm text-brand-muted">
                  <MapPin className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                  <span>70 Lạc Long Quân, P. Quy Nhơn Bắc, Tỉnh Gia Lai (Ngã 3 Phú Tài)</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right: contact form (from screenshot 5) */}
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <input
                  type="text" placeholder="Your Name" required
                  value={contactForm.name}
                  onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                />
                <input
                  type="email" placeholder="Your Email" required
                  value={contactForm.email}
                  onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                />
                <input
                  type="text" placeholder="Subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm((p) => ({ ...p, subject: e.target.value }))}
                  className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                />
                <textarea
                  placeholder="Message" rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none"
                />
                <button
                  type="submit"
                  className="bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 text-sm transition-all hover:-translate-y-0.5 shadow-card"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </section>

          {/* ══ Footer ══ */}
          <footer className="bg-brand-blue border-t border-blue-800">
            <div className="max-w-5xl mx-auto px-4 py-10">
              <div className="grid sm:grid-cols-3 gap-8 mb-8">
                {/* Brand */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Bus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-extrabold text-sm">TRƯỜNG THỊNH</p>
                      <p className="text-white/50 text-[10px] italic">Phụng sự để dẫn đầu</p>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Công ty TNHH Thương mại Vận tải Trường Thịnh — thành lập năm 2008, chuyên vận chuyển hành khách và hàng hóa.
                  </p>
                </div>

                {/* Contact */}
                <div>
                  <p className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-3">Liên hệ</p>
                  <div className="space-y-2">
                    <a href="tel:19005445" className="flex items-center gap-2 text-white/70 hover:text-brand-gold text-sm transition-colors">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      1900.54.54.45 (Đặt vé)
                    </a>
                    <a href="tel:19005555" className="flex items-center gap-2 text-white/70 hover:text-brand-gold text-sm transition-colors">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      1900.55.55.44 (Gửi hàng)
                    </a>
                    <a href="mailto:xetruongthinh@gmail.com" className="flex items-center gap-2 text-white/70 hover:text-brand-gold text-sm transition-colors">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      xetruongthinh@gmail.com
                    </a>
                    <div className="flex items-start gap-2 text-white/70 text-sm">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>70 Lạc Long Quân, Quy Nhơn Bắc, Gia Lai</span>
                    </div>
                  </div>
                </div>

                {/* Quick links */}
                <div>
                  <p className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-3">Dịch vụ</p>
                  <div className="space-y-2">
                    {[
                      ["Tuyến chạy & Giá vé", "/service-transport"],
                      ["Quy định khi đi xe", "/service-transport#quy_dinh"],
                      ["Vận tải hàng hóa", "/service-of-goods"],
                      ["Tra cứu đơn hàng", "https://trackingtruongthinh.smartpost.vn"],
                      ["Powered by AutoTicket AI 🤖", "#"],
                    ].map(([label, href]) => (
                      <a key={label} href={href} className="block text-white/60 hover:text-brand-gold text-sm transition-colors">
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
                <p>© 2026 Xe Trường Thịnh. All rights reserved.</p>
                <p>Powered by <span className="text-brand-gold font-semibold">AutoTicket AI</span></p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ══ BOOKING FLOW (steps: seat → checkout → payment) ══ */}
      {isInFlow && (
        <div
          id="booking-flow"
          className="pt-[72px] min-h-screen bg-brand-bg flex flex-col items-center justify-start p-4 pb-16"
        >
          {/* Route banner */}
          <div className="w-full max-w-md mt-8 mb-4 text-center animate-fade-in-up">
            <p className="text-xs text-brand-muted uppercase tracking-widest mb-1 font-semibold">
              Đặt vé
            </p>
            <h2 className="text-lg font-extrabold text-brand-text">
              {activeRoute.origin}
              <span className="text-brand-blue mx-2">→</span>
              {activeRoute.destination}
            </h2>
            <p className="text-brand-muted text-sm mt-0.5">📅 {activeRoute.date}</p>
          </div>

          {/* Step progress bar */}
          <div className="w-full max-w-md">
            <StepBar current={step} />
          </div>

          {/* Step panels */}
          <div className="w-full max-w-md">
            {step === "seat" && (
              <div className="animate-scale-in">
                <SeatSelection
                  onConfirm={(ids) => {
                    setSeats(ids);
                    setStep("checkout");
                  }}
                />
                <button
                  onClick={() => setStep("browse")}
                  className="mt-4 w-full text-sm text-brand-muted hover:text-brand-blue text-center transition-colors py-2"
                >
                  ← Quay lại trang chủ
                </button>
              </div>
            )}

            {step === "checkout" && (
              <div className="animate-scale-in">
                <CheckoutForm
                  selectedSeats={selectedSeats}
                  route={activeRoute}
                  onBack={() => setStep("seat")}
                  onSuccess={async (name, phone) => {
                    setCustomerName(name);
                    setCustomerPhone(phone);
                    // ── Create PayOS payment order ──
                    setCreating(true);
                    try {
                      const description = `${activeRoute.origin}-${activeRoute.destination}-${phone}`;
                      const pPayload = await createMockPayOSPayment(
                        selectedSeats.length * activeRoute.price,
                        description
                      );
                      setPayosPayload(pPayload);
                      setStep("payment");
                    } catch (err) {
                      console.error("Payment creation failed", err);
                      alert("Không tạo được đơn thanh toán. Vui lòng thử lại.");
                    } finally {
                      setCreating(false);
                    }
                  }}
                />
                {/* Loading overlay while creating PayOS order */}
                {creatingPayment && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center gap-3 shadow-2xl">
                      <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                      <p className="text-brand-text font-semibold text-sm">Đang tạo đơn thanh toán...</p>
                      <p className="text-brand-muted text-xs">Kết nối PayOS · Vui lòng chờ</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === "payment" && payosPayload && (
              <div className="animate-scale-in">
                <QRPayment
                  payload={payosPayload}
                  phone={customerPhone}
                  customerName={customerName}
                  seats={selectedSeats}
                  route={activeRoute}
                  onBack={() => setStep("checkout")}
                  onConfirmed={() => {
                    setStep("browse");
                    setSeats([]);
                    setCustomerName("");
                    setCustomerPhone("");
                    setPayosPayload(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
