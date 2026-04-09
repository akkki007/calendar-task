"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { buildCalendarGrid } from "@/lib/dateUtils";
import { CalendarDay, MonthYear, NavigationDirection } from "@/lib/types";

const STORAGE_KEY = "wall-calendar-last-view";

function getCurrentMonthYear(): MonthYear {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

export function useCalendar() {
  const [monthYear, setMonthYear] = useState<MonthYear>(getCurrentMonthYear);
  const [direction, setDirection] = useState<NavigationDirection>("forward");
  const hasRestoredRef = useRef(false);

  const { month, year } = monthYear;

  // Restore from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: MonthYear = JSON.parse(saved);
        setMonthYear(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(monthYear));
    } catch {
      // ignore
    }
  }, [monthYear]);

  const calendarDays: CalendarDay[] = useMemo(
    () => buildCalendarGrid(year, month),
    [year, month]
  );

  const goToNextMonth = useCallback(() => {
    setDirection("forward");
    setMonthYear((prev) => {
      if (prev.month === 11) {
        return { month: 0, year: prev.year + 1 };
      }
      return { month: prev.month + 1, year: prev.year };
    });
  }, []);

  const goToPrevMonth = useCallback(() => {
    setDirection("backward");
    setMonthYear((prev) => {
      if (prev.month === 0) {
        return { month: 11, year: prev.year - 1 };
      }
      return { month: prev.month - 1, year: prev.year };
    });
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    const target = { month: now.getMonth(), year: now.getFullYear() };
    setDirection(
      target.year > monthYear.year ||
        (target.year === monthYear.year && target.month > monthYear.month)
        ? "forward"
        : "backward"
    );
    setMonthYear(target);
  }, [monthYear]);

  return {
    month,
    year,
    calendarDays,
    direction,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
  };
}
