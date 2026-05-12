"use client";

import { useState } from "react";
import { User } from "lucide-react";

// ── Seat status types ──
type SeatStatus = "available" | "selected" | "booked" | "driver";

interface Seat {
  id: string;
  label: string;
  status: SeatStatus;
}

// ── Generate a realistic 34-seat sleeper bus layout (2-1 per row, 12 rows) ──
function generateSeats(bookedIds: string[] = []): Seat[] {
  const seats: Seat[] = [];
  // Vietnamese sleeper buses: rows A-L, columns 1-3 (col 2 is aisle for 2-1 layout)
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  rows.forEach((row, rowIdx) => {
    // Left pair (col 1, 2) + right single (col 3)
    [1, 2, 3].forEach((col) => {
      if (col === 2 && rowIdx < 2) return; // front rows: no middle seat (driver cabin)
      const id = `${row}${col}`;
      seats.push({
        id,
        label: id,
        status: bookedIds.includes(id)
          ? "booked"
          : rowIdx === 0 && col === 1
          ? "driver"
          : "available",
      });
    });
  });
  return seats;
}

// ── Single seat button ──
function SeatButton({
  seat,
  onClick,
}: {
  seat: Seat;
  onClick: (id: string) => void;
}) {
  const cls: Record<SeatStatus, string> = {
    available: "seat-available",
    selected:  "seat-selected",
    booked:    "seat-booked",
    driver:    "seat-driver",
  };

  return (
    <button
      type="button"
      disabled={seat.status === "booked" || seat.status === "driver"}
      onClick={() => onClick(seat.id)}
      title={
        seat.status === "driver"
          ? "Tài xế"
          : seat.status === "booked"
          ? "Đã đặt"
          : `Chỗ ${seat.label}`
      }
      className={`
        w-10 h-10 rounded-lg text-xs font-bold flex items-center justify-center
        ${cls[seat.status]}
      `}
    >
      {seat.status === "driver" ? <User className="w-4 h-4" /> : seat.label}
    </button>
  );
}

// ── Legend item ──
function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-4 h-4 rounded ${color} border border-gray-200`} />
      <span className="text-xs text-brand-muted">{label}</span>
    </div>
  );
}

interface SeatSelectionProps {
  /** IDs of pre-booked seats, e.g. ["A1", "B2", "D3"] */
  preBookedSeats?: string[];
  onConfirm: (selectedIds: string[]) => void;
}

export default function SeatSelection({
  preBookedSeats = ["B1", "C2", "E3", "F1", "G2", "H3", "I1"],
  onConfirm,
}: SeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>(() =>
    generateSeats(preBookedSeats)
  );

  const selectedIds = seats
    .filter((s) => s.status === "selected")
    .map((s) => s.id);

  const toggleSeat = (id: string) => {
    setSeats((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "selected" ? "available" : "selected" }
          : s
      )
    );
  };

  // Pair seats into rows: [col1, col2, col3] — col2 is aisle gap
  const rows = ["A","B","C","D","E","F","G","H","I","J","K","L"];

  const getSeat = (row: string, col: number) =>
    seats.find((s) => s.id === `${row}${col}`);

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-brand-blue px-5 py-3 flex items-center gap-2">
        <span className="text-white font-bold text-sm uppercase tracking-wider">
          🚌 Chọn chỗ ngồi
        </span>
      </div>

      <div className="p-5">
        {/* ── Bus diagram wrapper ── */}
        <div className="relative border-2 border-brand-border rounded-2xl p-4 bg-gray-50 max-w-[280px] mx-auto">
          {/* Windshield shape at top */}
          <div className="bg-sky-100 border border-sky-200 rounded-xl h-8 flex items-center justify-center mb-4">
            <span className="text-sky-600 text-[10px] font-semibold uppercase tracking-widest">
              Đầu xe
            </span>
          </div>

          {/* Seat rows */}
          <div className="space-y-2">
            {rows.map((row) => {
              const s1 = getSeat(row, 1);
              const s2 = getSeat(row, 2);
              const s3 = getSeat(row, 3);
              return (
                <div key={row} className="flex items-center gap-1.5">
                  {/* Left pair */}
                  <div className="flex gap-1.5">
                    {s1 && <SeatButton seat={s1} onClick={toggleSeat} />}
                    {s2 && <SeatButton seat={s2} onClick={toggleSeat} />}
                    {!s2 && <div className="w-10" />}
                  </div>
                  {/* Aisle gap */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="h-px w-4 bg-brand-border" />
                  </div>
                  {/* Right single */}
                  {s3 && <SeatButton seat={s3} onClick={toggleSeat} />}
                </div>
              );
            })}
          </div>

          {/* Back bumper */}
          <div className="bg-gray-200 rounded-xl h-5 flex items-center justify-center mt-4">
            <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest">
              Đuôi xe
            </span>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <LegendDot color="bg-white border-brand-blue/40" label="Trống" />
          <LegendDot color="bg-brand-blue" label="Đã chọn" />
          <LegendDot color="bg-gray-200" label="Đã đặt" />
        </div>

        {/* ── Selected summary ── */}
        <div className="mt-4 p-3 bg-brand-bg rounded-xl border border-brand-border text-sm text-brand-muted text-center">
          {selectedIds.length === 0 ? (
            "Chưa chọn chỗ nào. Nhấn vào ô trắng để chọn."
          ) : (
            <>
              Đã chọn{" "}
              <span className="font-bold text-brand-blue">
                {selectedIds.length}
              </span>{" "}
              chỗ:{" "}
              <span className="font-semibold text-brand-text">
                {selectedIds.join(", ")}
              </span>
            </>
          )}
        </div>

        {/* ── Confirm button ── */}
        <button
          disabled={selectedIds.length === 0}
          onClick={() => onConfirm(selectedIds)}
          className="mt-4 w-full bg-brand-gold hover:bg-brand-gold-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-gold transition-all hover:-translate-y-0.5 text-sm"
        >
          Xác nhận {selectedIds.length > 0 ? `${selectedIds.length} chỗ` : "chỗ ngồi"}
        </button>
      </div>
    </div>
  );
}
