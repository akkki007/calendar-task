"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildCalendarGrid } from "@/lib/dateUtils";
import { MONTH_NAMES, DAY_LABELS } from "@/lib/constants";

interface MiniCalendarProps {
  month: number;
  year: number;
  label: "Previous" | "Next";
}

export default function MiniCalendar({ month, year, label }: MiniCalendarProps) {
  const days = useMemo(() => buildCalendarGrid(year, month), [year, month]);

  const rows: { date: number; isCurrentMonth: boolean; isToday: boolean }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }

  return (
    <div
      className="rounded-lg px-3 py-2.5 transition-colors"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg-page) 50%, var(--bg-calendar))",
        minWidth: 170,
      }}
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-center gap-1.5">
        {label === "Previous" && (
          <ChevronLeft size={12} style={{ color: "var(--text-secondary)", opacity: 0.6 }} />
        )}
        <div className="text-center">
          <span
            className="text-[11px] font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {MONTH_NAMES[month]}
          </span>
          <span
            className="ml-1 text-[10px] font-normal"
            style={{ color: "var(--text-secondary)" }}
          >
            {year}
          </span>
        </div>
        {label === "Next" && (
          <ChevronRight size={12} style={{ color: "var(--text-secondary)", opacity: 0.6 }} />
        )}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0 mb-0.5">
        {DAY_LABELS.map((d) => (
          <span
            key={d}
            className="text-center text-[8px] font-bold uppercase leading-4"
            style={{ color: "var(--text-secondary)", opacity: 0.5 }}
          >
            {d.charAt(0)}
          </span>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-0">
        {rows.flat().map((day, i) => (
          <span
            key={i}
            className="flex items-center justify-center text-center text-[10px] leading-[18px]"
            style={{
              color: !day.isCurrentMonth
                ? "transparent"
                : day.isToday
                  ? "var(--accent-start)"
                  : "var(--text-primary)",
              fontWeight: day.isToday ? 700 : 400,
              borderRadius: day.isToday ? "50%" : undefined,
              backgroundColor: day.isToday
                ? "color-mix(in srgb, var(--accent-start) 12%, transparent)"
                : undefined,
              width: 18,
              height: 18,
              margin: "0 auto",
            }}
          >
            {day.isCurrentMonth ? day.date : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
