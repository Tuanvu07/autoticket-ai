"use client";

import { useState } from "react";
import { MapPin, Calendar, Clock, Users, Search, ChevronRight } from "lucide-react";

// ── Booking form matches screenshot layout: 5-col top row + 2-col contact row ──
const CITIES = [
  "Quy Nhơn", "Sài Gòn (Bến xe Miền Đông)", "Đà Lạt",
  "Hà Nội", "Huế", "Vinh", "Thanh Hóa", "Nha Trang",
  "Đà Nẵng", "Buôn Ma Thuột", "Phan Thiết",
];

// ── Sub: Label + input wrapper ──
function FieldWrapper({
  label, children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider mb-1.5 px-1">
        {label}
      </label>
      {children}
    </div>
  );
}

const INPUT_CLS =
  "w-full border border-brand-border rounded-lg px-3 py-2.5 text-sm text-brand-text placeholder-brand-subtle bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition";

export default function HeroSection() {
  const [origin, setOrigin]      = useState("");
  const [destination, setDest]   = useState("");
  const [date, setDate]          = useState("");
  const [time, setTime]          = useState("");
  const [quantity, setQuantity]  = useState(1);
  const [name, setName]          = useState("");
  const [phone, setPhone]        = useState("");
  const [email, setEmail]        = useState("");
  const [note, setNote]          = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Đã gửi yêu cầu đặt vé!\n${origin} → ${destination}\nNgày: ${date} | Giờ: ${time}\nKhách: ${name} | SĐT: ${phone}`);
  };

  return (
    <>
      {/* ══════════════════════════════
          HERO: Full-width photo banner
          (replicates blue bus fleet on mountain background)
      ══════════════════════════════ */}
      <section className="relative w-full h-[420px] sm:h-[520px] overflow-hidden mt-[72px]">
        {/* Background — gradient that evokes the fjord/mountain landscape photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-blue-900 to-slate-900" />

        {/* Decorative layered mountain silhouette */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
        >
          <path d="M0,160 L200,80 L400,140 L600,60 L800,130 L1000,50 L1200,110 L1440,70 L1440,220 L0,220Z"
            fill="rgba(255,255,255,0.04)" />
          <path d="M0,200 L300,120 L500,180 L700,100 L900,160 L1100,90 L1300,150 L1440,110 L1440,220 L0,220Z"
            fill="rgba(255,255,255,0.06)" />
        </svg>

        {/* Radial light glow center-right */}
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl" />

        {/* ── Hotline red banner (top-left, exactly like screenshot) ── */}
        <div className="absolute top-8 left-6 sm:left-12 bg-brand-red text-white font-bold text-sm sm:text-base px-5 py-2.5 rounded-full shadow-cta animate-slide-in flex items-center gap-2">
          📞 Tổng đài: 1900 54 54 45 – 1900 55 55 44
        </div>

        {/* ── Hero headline ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 mt-8">
          <h1 className="text-white font-extrabold text-3xl sm:text-5xl md:text-6xl leading-tight drop-shadow-lg animate-fade-up">
            Xe Khách{" "}
            <span className="text-brand-gold">Trường Thịnh</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-lg mt-3 max-w-xl animate-fade-up [animation-delay:100ms]">
            Phụng sự để dẫn đầu — Đặt vé nhanh · Giá minh bạch · Hỗ trợ 24/7
          </p>
          <div className="flex gap-3 mt-5 animate-fade-up [animation-delay:200ms]">
            <a href="#dat-ve"
              className="bg-brand-gold hover:bg-brand-gold-dark text-white font-bold px-6 py-2.5 rounded-full shadow-gold transition-all hover:-translate-y-0.5 text-sm">
              🎫 Đặt vé ngay
            </a>
            <a href="/service-transport"
              className="border border-white/40 text-white hover:bg-white/10 font-semibold px-6 py-2.5 rounded-full transition-all text-sm flex items-center gap-1">
              Xem tuyến <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom fade into page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-bg to-transparent" />
      </section>

      {/* ══════════════════════════════
          BOOKING FORM — matches screenshot layout
      ══════════════════════════════ */}
      <section id="dat-ve" className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 relative z-10 pb-12">
        <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden">
          {/* Header strip */}
          <div className="bg-brand-blue px-6 py-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-white" />
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">
              Đặt vé / Hàng hóa
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6">
            {/* ── Row 1: 5-column trip info (matches screenshot) ── */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
              <FieldWrapper label="Điểm đi">
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className={INPUT_CLS + " pl-8 appearance-none"}
                    required
                  >
                    <option value="">Nhập điểm đi</option>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </FieldWrapper>

              <FieldWrapper label="Điểm đến">
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
                  <select
                    value={destination}
                    onChange={(e) => setDest(e.target.value)}
                    className={INPUT_CLS + " pl-8 appearance-none"}
                    required
                  >
                    <option value="">Nhập điểm đến</option>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </FieldWrapper>

              <FieldWrapper label="Ngày đi">
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
                  <input
                    type="date" value={date} min={today}
                    onChange={(e) => setDate(e.target.value)}
                    className={INPUT_CLS + " pl-8"}
                    required
                  />
                </div>
              </FieldWrapper>

              <FieldWrapper label="Giờ đi">
                <div className="relative">
                  <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
                  <input
                    type="time" value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={INPUT_CLS + " pl-8"}
                  />
                </div>
              </FieldWrapper>

              <FieldWrapper label="Số lượng">
                <div className="relative">
                  <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" />
                  <input
                    type="number" min={1} max={50} value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className={INPUT_CLS + " pl-8"}
                  />
                </div>
              </FieldWrapper>
            </div>

            {/* Divider */}
            <div className="border-t border-brand-border my-4" />

            {/* ── Row 2: Contact info (2-col, matches screenshot) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-brand-text w-24 flex-shrink-0">
                  Họ tên <span className="text-brand-red">*</span>:
                </label>
                <input
                  type="text" value={name} placeholder=""
                  onChange={(e) => setName(e.target.value)}
                  required className={INPUT_CLS + " flex-1"}
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-brand-text w-24 flex-shrink-0">
                  Điện thoại <span className="text-brand-red">*</span>:
                </label>
                <input
                  type="tel" value={phone} placeholder=""
                  onChange={(e) => setPhone(e.target.value)}
                  required className={INPUT_CLS + " flex-1"}
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-brand-text w-24 flex-shrink-0">
                  Email <span className="text-brand-red">*</span>:
                </label>
                <input
                  type="email" value={email} placeholder=""
                  onChange={(e) => setEmail(e.target.value)}
                  required className={INPUT_CLS + " flex-1"}
                />
              </div>

              <div className="flex items-start gap-3">
                <label className="text-sm font-medium text-brand-text w-24 flex-shrink-0 pt-2.5">
                  Ghi chú :
                </label>
                <textarea
                  value={note} rows={3} placeholder=""
                  onChange={(e) => setNote(e.target.value)}
                  className={INPUT_CLS + " flex-1 resize-none"}
                />
              </div>
            </div>

            {/* ── Submit button (gold, centered — exactly like screenshot) ── */}
            <div className="flex justify-center mt-2">
              <button
                type="submit"
                className="bg-brand-gold hover:bg-brand-gold-dark text-white font-bold px-10 py-3 rounded-lg shadow-gold transition-all hover:-translate-y-0.5 text-base"
              >
                Gửi yêu cầu
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
