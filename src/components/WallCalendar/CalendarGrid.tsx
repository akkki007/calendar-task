"use client";

import { motion } from "framer-motion";
import { CalendarDay } from "@/lib/types";
import { DAY_LABELS } from "@/lib/constants";
import { getMonthKey } from "@/lib/dateUtils";
import DayCell from "./DayCell";

interface CalendarGridProps {
  days: CalendarDay[];
  month: number;
  year: number;
  rangeStart: CalendarDay | null;
  rangeEnd: CalendarDay | null;
  previewEnd: CalendarDay | null;
  hasNoteForDay: (monthKey: string, dayDate: number) => boolean;
  onDayClick: (day: CalendarDay) => void;
  onDayHover: (day: CalendarDay | null) => void;
  onKeyNavigation: (e: React.KeyboardEvent) => void;
}

const rowVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cellVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 },
  },
};

export default function CalendarGrid({
  days,
  month,
  year,
  rangeStart,
  rangeEnd,
  previewEnd,
  hasNoteForDay,
  onDayClick,
  onDayHover,
  onKeyNavigation,
}: CalendarGridProps) {
  const monthKey = getMonthKey(year, month);
  const rows: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }

  return (
    <div
      role="grid"
      aria-label="Calendar dates"
      className="px-3 pb-4 md:px-5 md:pb-5"
      onKeyDown={onKeyNavigation}
    >
      {/* Day header row */}
      <div role="row" className="mb-2 grid grid-cols-7 gap-0.5">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            role="columnheader"
            className="flex items-center justify-center py-2 text-[11px] font-semibold uppercase tracking-[1.5px] md:text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Date rows with staggered animation */}
      <motion.div
        key={`${month}-${year}`}
        variants={rowVariants}
        initial="hidden"
        animate="visible"
      >
        {rows.map((row, rowIdx) => (
          <motion.div
            key={rowIdx}
            role="row"
            className="grid grid-cols-7 gap-0.5"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.3,
                  delay: rowIdx * 0.05,
                  staggerChildren: 0.03,
                },
              },
            }}
          >
            {row.map((day) => (
              <motion.div key={`${day.year}-${day.month}-${day.date}`} variants={cellVariants}>
                <DayCell
                  day={day}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  previewEnd={previewEnd}
                  hasNote={
                    day.isCurrentMonth && hasNoteForDay(monthKey, day.date)
                  }
                  onClick={onDayClick}
                  onHover={onDayHover}
                />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
