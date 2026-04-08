export interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
}

export interface CalendarNote {
  id: string;
  monthKey: string; // "2026-04"
  rangeKey?: string; // "2026-04-08-2026-04-15"
  content: string;
  updatedAt: number;
}

export interface DateRange {
  start: CalendarDay | null;
  end: CalendarDay | null;
}

export type RangeSelectionState = "IDLE" | "SELECTING_START" | "RANGE_COMPLETE";

export type Theme = "light" | "dark";

export type NavigationDirection = "forward" | "backward";

export interface MonthYear {
  month: number; // 0-11
  year: number;
}
