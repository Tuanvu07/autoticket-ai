"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Phone, ChevronDown, Menu, X, Bus, Package } from "lucide-react";

// ── Full nav extracted from all 5 screenshots ──
const NAV = [
  { label: "Trang chủ", href: "/" },
  {
    label: "Giới thiệu",
    href: "/gioi-thieu",
    children: [
      { label: "Về chúng tôi", href: "/gioi-thieu" },
      { label: "Đội ngũ lãnh đạo", href: "/gioi-thieu#lanh-dao" },
    ],
  },
  {
    label: "Dịch vụ vận chuyển hành khách",
    href: "/service-transport",
    children: [
      { label: "Tuyến chạy và giá vé", href: "/service-transport" },
      { label: "Quy định khi đi xe", href: "/service-transport#quy_dinh" },
      { label: "Chính sách đổi trả vé", href: "/service-transport#doi-tra" },
      { label: "Liên hệ đặt vé", href: "/#contact" },
    ],
  },
  {
    // Extracted from screenshot 1: "Dịch vụ vận tải hàng hóa" dropdown
    label: "Dịch vụ vận tải hàng hóa",
    href: "/service-of-goods",
    children: [
      { label: "Các gói dịch vụ vận chuyển", href: "/service-of-goods" },
      { label: "Quy định về vận chuyển và đóng gói", href: "/service-of-goods#quy-dinh" },
      { label: "Liên hệ gửi hàng", href: "/service-of-goods#lien_he" },
      { label: "Tra cứu đơn hàng online", href: "https://trackingtruongthinh.smartpost.vn" },
    ],
  },
  {
    label: "Tin tức",
    href: "/news",
    children: [
      { label: "Địa điểm du lịch", href: "/news/dia-diem-du-lich" },
      { label: "Tin tức xã hội", href: "/news/tin-tuc-xa-hoi" },
      { label: "Thông báo từ Trường Thịnh", href: "/news/thong-bao" },
      { label: "Tuyển dụng", href: "/news/tuyen-dung" },
    ],
  },
  { label: "Tuyển dụng", href: "/news/tuyen-dung" },
  { label: "Liên hệ", href: "/#contact" },
];

function Dropdown({
  items,
  onClose,
}: {
  items: { label: string; href: string }[];
  onClose: () => void;
}) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/95 backdrop-blur-md border border-brand-border rounded-2xl shadow-glass min-w-[230px] py-2 z-50 animate-scale-in origin-top">
      {/* Tiny triangle pointer */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-brand-border rotate-45" />
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-brand-muted hover:text-brand-blue hover:bg-blue-50/70 transition-all duration-150 group"
        >
          <span className="w-1 h-1 rounded-full bg-brand-blue/30 group-hover:bg-brand-blue transition-colors flex-shrink-0" />
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeDropdown, setActive]       = useState<string | null>(null);
  const [expandedMobile, setExpandMobile] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const enter = (label: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActive(label);
  };
  const leave = () => {
    timerRef.current = setTimeout(() => setActive(null), 180);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
          ${scrolled
            ? "bg-white/95 backdrop-blur-md shadow-header"
            : "bg-white border-b border-brand-border"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[72px] gap-4">

            {/* ── Logo — circular blue mark from screenshots ── */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="w-[54px] h-[54px] rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center shadow-md border-[3px] border-blue-100 group-hover:scale-105 transition-transform duration-200">
                <Bus className="w-7 h-7 text-white" />
              </div>
              <div className="leading-tight hidden sm:block">
                <p className="text-brand-blue font-extrabold text-[15px] tracking-wide uppercase leading-tight">
                  TRƯỜNG THỊNH
                </p>
                <p className="text-brand-muted text-[10px] font-medium italic">
                  Phụng sự để dẫn đầu
                </p>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
              {NAV.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && enter(item.label)}
                  onMouseLeave={leave}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-[12.5px] font-medium whitespace-nowrap transition-all duration-150
                      ${item.label === "Trang chủ"
                        ? "text-brand-blue font-semibold"
                        : item.label === "Liên hệ"
                        ? "text-brand-blue-light hover:text-brand-blue"
                        : "text-gray-600 hover:text-brand-blue hover:bg-blue-50/60"
                      }`}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown
                        className={`w-3 h-3 flex-shrink-0 transition-transform duration-200
                          ${activeDropdown === item.label ? "rotate-180 text-brand-blue" : "text-gray-400"}`}
                      />
                    )}
                  </Link>
                  {item.children && activeDropdown === item.label && (
                    <Dropdown items={item.children} onClose={() => setActive(null)} />
                  )}
                </div>
              ))}
            </nav>

            {/* ── Hotline CTA ── */}
            <a
              href="tel:19005445"
              className="hidden xl:flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white text-[13px] font-bold px-4 py-2.5 rounded-full shadow-cta transition-all duration-200 hover:-translate-y-0.5 flex-shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              1900 54 54 45
            </a>

            {/* ── Mobile toggle ── */}
            <button
              className="xl:hidden p-2.5 text-gray-600 hover:text-brand-blue rounded-xl hover:bg-blue-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="xl:hidden bg-white/98 backdrop-blur-md border-t border-brand-border max-h-[85dvh] overflow-y-auto animate-fade-in-up">
            <div className="px-4 py-3 space-y-1 pb-6">
              {NAV.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setExpandMobile(expandedMobile === item.label ? null : item.label)
                    }
                    className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-xl transition-colors text-left"
                  >
                    <Link
                      href={item.href}
                      onClick={() => !item.children && setMobileOpen(false)}
                      className="flex-1"
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                          expandedMobile === item.label ? "rotate-180 text-brand-blue" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Mobile sub-items */}
                  {item.children && expandedMobile === item.label && (
                    <div className="ml-4 mt-0.5 mb-1 space-y-0.5 border-l-2 border-blue-100 pl-3 animate-fade-in-up">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 py-2 text-[13px] text-brand-muted hover:text-brand-blue transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue/30 flex-shrink-0" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile hotlines (from screenshot 5) */}
              <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100 space-y-1.5">
                <p className="text-xs text-brand-red font-semibold flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5" /> Tổng đài đặt vé:
                </p>
                <a href="tel:19005445" className="block text-brand-red font-bold text-sm">
                  1900.54.54.45 – 098.443.2222
                </a>
                <p className="text-xs text-brand-red font-semibold flex items-center gap-1.5 mt-1">
                  <Package className="w-3.5 h-3.5" /> Tổng đài gửi hàng:
                </p>
                <a href="tel:19005555" className="block text-brand-red font-bold text-sm">
                  1900.55.55.44 – 0888.024.024
                </a>
              </div>

              <a
                href="tel:19005445"
                className="flex items-center justify-center gap-2 mt-2 bg-brand-red text-white font-bold px-4 py-3 rounded-full text-sm shadow-cta"
              >
                <Phone className="w-4 h-4" />
                Gọi ngay: 1900 54 54 45
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ── Persistent floating "Đặt vé/hàng" CTA — from all screenshots ── */}
      <a
        href="/#dat-ve"
        className="fixed bottom-6 right-5 z-50 flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm px-5 py-3 rounded-full shadow-cta transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(198,40,40,0.5)] animate-pulse2 select-none"
      >
        🎫 Đặt vé/hàng
      </a>
    </>
  );
}
