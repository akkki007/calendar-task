"use client";

import { useState, useCallback } from "react";
import {
  CalendarDay,
  DateRange,
  RangeSelectionState,
} from "@/lib/types";
import { compareDays, isSameDay } from "@/lib/dateUtils";

export function useDateRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [selectionState, setSelectionState] =
    useState<RangeSelectionState>("IDLE");
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null);

  const handleDayClick = useCallback(
    (day: CalendarDay) => {
      if (!day.isCurrentMonth) return;

      switch (selectionState) {
        case "IDLE":
        case "RANGE_COMPLETE":
          setRange({ start: day, end: null });
          setSelectionState("SELECTING_START");
          break;

        case "SELECTING_START": {
          if (range.start && isSameDay(day, range.start)) {
            // Clicked same day — deselect
            setRange({ start: null, end: null });
            setSelectionState("IDLE");
            return;
          }

          let start = range.start!;
          let end = day;

          // Ensure start < end
          if (compareDays(start, end) > 0) {
            [start, end] = [end, start];
          }

          setRange({ start, end });
          setSelectionState("RANGE_COMPLETE");
          break;
        }
      }
    },
    [selectionState, range.start]
  );

  const handleDayHover = useCallback(
    (day: CalendarDay | null) => {
      if (selectionState === "SELECTING_START") {
        setHoveredDay(day);
      }
    },
    [selectionState]
  );

  const clearSelection = useCallback(() => {
    setRange({ start: null, end: null });
    setSelectionState("IDLE");
    setHoveredDay(null);
  }, []);

  // Compute the preview range (while selecting)
  const previewEnd =
    selectionState === "SELECTING_START" && hoveredDay ? hoveredDay : null;

  return {
    range,
    selectionState,
    hoveredDay,
    previewEnd,
    handleDayClick,
    handleDayHover,
    clearSelection,
  };
}
