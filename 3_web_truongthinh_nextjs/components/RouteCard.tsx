"use client";

import { ArrowLeftRight } from "lucide-react";

// ── Props matching the route table in screenshot ──
export interface RouteCardProps {
  origin:      string;
  destination: string;
  busType:     string;  // e.g. "xe 44 giường", "xe 34 phòng"
  price:       number;
  isEven?:     boolean; // for alternating row bg, matching screenshot table
}

const formatPrice = (price: number) =>
  price.toLocaleString("vi-VN") + "đ/vé";

export default function RouteCard({
  origin,
  destination,
  busType,
  price,
  isEven = false,
}: RouteCardProps) {
  return (
    <div
      className={`
        grid grid-cols-[1fr_auto_1fr_1fr_auto] items-center gap-4
        px-4 sm:px-6 py-4 border-b border-brand-border
        transition-colors hover:bg-blue-50/60 group
        ${isEven ? "bg-gray-50" : "bg-white"}
      `}
    >
      {/* Origin */}
      <span className="font-semibold text-brand-text text-sm sm:text-base">
        {origin}
      </span>

      {/* Double-arrow icon (matches ⇌ in screenshot) */}
      <ArrowLeftRight className="w-4 h-4 text-brand-muted flex-shrink-0" />

      {/* Destination */}
      <span className="font-semibold text-brand-text text-sm sm:text-base">
        {destination}
      </span>

      {/* Bus type */}
      <span className="text-brand-muted text-sm hidden sm:block">
        ({busType})
      </span>

      {/* Price — right-aligned, matches screenshot */}
      <span className="text-brand-text font-bold text-sm sm:text-base text-right whitespace-nowrap">
        {formatPrice(price)}
      </span>
    </div>
  );
}
