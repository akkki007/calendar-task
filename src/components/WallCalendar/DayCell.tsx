"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarDay } from "@/lib/types";
import { isSameDay, isDayInRange, compareDays, formatDateLabel } from "@/lib/dateUtils";

interface DayCellProps {
  day: CalendarDay;
  rangeStart: CalendarDay | null;
  rangeEnd: CalendarDay | null;
  previewEnd: CalendarDay | null;
  hasNote: boolean;
  onClick: (day: CalendarDay) => void;
  onHover: (day: CalendarDay | null) => void;
}

const DayCell = React.memo(function DayCell({
  day,
  rangeStart,
  rangeEnd,
  previewEnd,
  hasNote,
  onClick,
  onHover,
}: DayCellProps) {
  const isStart = rangeStart ? isSameDay(day, rangeStart) : false;
  const isEnd = rangeEnd ? isSameDay(day, rangeEnd) : false;
  const isInRange = isDayInRange(day, rangeStart, rangeEnd);

  // Preview range while hovering during selection
  let isInPreview = false;
  let isPreviewEnd = false;
  if (rangeStart && previewEnd && !rangeEnd) {
    let pStart = rangeStart;
    let pEnd = previewEnd;
    if (compareDays(pStart, pEnd) > 0) [pStart, pEnd] = [pEnd, pStart];
    isInPreview = isDayInRange(day, pStart, pEnd);
    isPreviewEnd = isSameDay(day, previewEnd);
  }

  // Determine styling
  let cellClasses = "relative flex items-center justify-center rounded-lg cursor-pointer select-none transition-colors duration-150 ";
  let textClasses = "text-sm md:text-base font-normal ";
  let bgStyle = "";

  if (!day.isCurrentMonth) {
    cellClasses += "opacity-40 cursor-default ";
    textClasses += "text-[var(--text-secondary)] ";
  } else if (isStart) {
    bgStyle = "var(--accent-start)";
    textClasses += "text-white font-bold ";
    cellClasses += "rounded-r-none rounded-l-full ";
  } else if (isEnd) {
    bgStyle = "var(--accent-end)";
    textClasses += "text-white font-bold ";
    cellClasses += "rounded-l-none rounded-r-full ";
  } else if (isInRange) {
    bgStyle = "var(--accent-range)";
    cellClasses += "rounded-none ";
    textClasses += day.isWeekend
      ? "text-[var(--text-weekend)] "
      : "text-[var(--text-primary)] ";
  } else if (isInPreview) {
    bgStyle = "var(--accent-range)";
    cellClasses += "rounded-none opacity-60 ";
    textClasses += "text-[var(--text-primary)] ";
  } else if (isPreviewEnd && !isStart) {
    bgStyle = "var(--accent-range)";
    cellClasses += "rounded-r-full rounded-l-none opacity-70 ";
    textClasses += "text-[var(--text-primary)] ";
  } else if (day.isWeekend) {
    textClasses += "text-[var(--text-weekend)] ";
  } else {
    textClasses += "text-[var(--text-primary)] ";
  }

  if (day.isToday && day.isCurrentMonth) {
    textClasses += "font-bold ";
  }

  return (
    <motion.button
      type="button"
      role="gridcell"
      aria-label={formatDateLabel(day)}
      aria-selected={isStart || isEnd || undefined}
      aria-disabled={!day.isCurrentMonth || undefined}
      tabIndex={day.isCurrentMonth ? 0 : -1}
      className={cellClasses + "h-10 w-full md:h-12"}
      style={{ backgroundColor: bgStyle || undefined }}
      onClick={() => day.isCurrentMonth && onClick(day)}
      onMouseEnter={() => day.isCurrentMonth && onHover(day)}
      onMouseLeave={() => onHover(null)}
      whileHover={
        day.isCurrentMonth
          ? { scale: 1.05, boxShadow: "0 2px 8px var(--shadow-color)" }
          : undefined
      }
      whileTap={day.isCurrentMonth ? { scale: 0.95 } : undefined}
      transition={{ duration: 0.15 }}
    >
      {/* Today indicator ring */}
      {day.isToday && day.isCurrentMonth && !isStart && !isEnd && (
        <span
          className="today-pulse absolute inset-1 rounded-full border-2"
          style={{ borderColor: "var(--accent-start)" }}
        />
      )}

      <span className={textClasses}>{day.date}</span>

      {/* Note indicator dot */}
      {hasNote && day.isCurrentMonth && (
        <span
          className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: "var(--accent-start)" }}
        />
      )}
    </motion.button>
  );
});

export default DayCell;
