"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { MONTH_NAMES } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";
import { Theme, NavigationDirection } from "@/lib/types";

interface CalendarHeaderProps {
  month: number;
  year: number;
  direction: NavigationDirection;
  theme: Theme;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onToggleTheme: () => void;
}

export default function CalendarHeader({
  month,
  year,
  direction,
  theme,
  onPrev,
  onNext,
  onToday,
  onToggleTheme,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          aria-label="Previous month"
          className="flex h-10 w-10 items-center justify-center rounded-lg md:h-9 md:w-9"
          style={{ color: "var(--text-primary)" }}
          onClick={onPrev}
          whileHover={{
            backgroundColor: theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)",
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronLeft size={20} />
        </motion.button>

        <div className="flex flex-col items-center min-w-[180px] md:min-w-[220px]">
          <motion.h2
            key={`${month}-${year}`}
            className="text-2xl font-bold leading-tight md:text-[32px] md:leading-[40px]"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
            initial={{
              opacity: 0,
              y: direction === "forward" ? 10 : -10,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {MONTH_NAMES[month]}
          </motion.h2>
          <motion.span
            key={`year-${month}-${year}`}
            className="text-xs font-light uppercase tracking-[4px] md:text-sm"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {year}
          </motion.span>
        </div>

        <motion.button
          type="button"
          aria-label="Next month"
          className="flex h-10 w-10 items-center justify-center rounded-lg md:h-9 md:w-9"
          style={{ color: "var(--text-primary)" }}
          onClick={onNext}
          whileHover={{
            backgroundColor: theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)",
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          aria-label="Go to today"
          className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium sm:flex"
          style={{
            color: "var(--accent-start)",
            border: "1px solid var(--border-color)",
          }}
          onClick={onToday}
          whileHover={{
            backgroundColor: theme === "light" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <CalendarDays size={14} />
          Today
        </motion.button>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </div>
  );
}
