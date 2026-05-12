import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xe Trường Thịnh – Đặt Vé Nhanh, Đi Chuẩn Giờ",
  description:
    "Đặt vé xe khách Trường Thịnh tuyến Sài Gòn – Đà Lạt và nhiều tuyến khác. Giá tốt, nhiều chuyến mỗi ngày, hỗ trợ 24/7 qua AI Agent.",
  keywords: ["xe khách", "đặt vé xe", "Sài Gòn Đà Lạt", "Trường Thịnh", "vé xe giá rẻ"],
  openGraph: {
    title: "Xe Trường Thịnh – Đặt Vé Online",
    description: "Đặt vé xe khách nhanh chóng, tiện lợi, hỗ trợ AI 24/7.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen antialiased">
        {children}

        {/*
          ════════════════════════════════════════════════════════
          AutoTicket AI — Embeddable Chat Widget
          ────────────────────────────────────────────────────────
          Loaded with strategy="lazyOnload" so it never blocks
          the main website's initial render.

          Replace the src URL below with your actual Vercel-hosted
          widget bundle URL after deploying 2_frontend_widget, e.g.:
            https://autoticket-widget.vercel.app/autoticket-widget.js

          The widget dispatches window event 'TICKET_BOT_ACTION'
          which page.tsx listens to via the Chat-to-Pay bridge.
          ════════════════════════════════════════════════════════
        */}
        <Script
          src="https://YOUR_VERCEL_WIDGET_LINK/autoticket-widget.js"
          strategy="lazyOnload"
          id="autoticket-widget"
        />
      </body>
    </html>
  );
}
