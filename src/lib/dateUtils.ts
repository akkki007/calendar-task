import { CalendarDay } from "./types";

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function isToday(year: number, month: number, date: number): boolean {
  const now = new Date();
  return (
    now.getFullYear() === year &&
    now.getMonth() === month &&
    now.getDate() === date
  );
}

export function isWeekend(dayOfWeek: number): boolean {
  return dayOfWeek === 0 || dayOfWeek === 6;
}

export function buildCalendarGrid(year: number, month: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Previous month overflow
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDay - 1; i >= 0; i--) {
    const date = daysInPrevMonth - i;
    const dow = new Date(prevYear, prevMonth, date).getDay();
    days.push({
      date,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isToday: isToday(prevYear, prevMonth, date),
      isWeekend: isWeekend(dow),
      dayOfWeek: dow,
    });
  }

  // Current month
  for (let date = 1; date <= daysInMonth; date++) {
    const dow = new Date(year, month, date).getDay();
    days.push({
      date,
      month,
      year,
      isCurrentMonth: true,
      isToday: isToday(year, month, date),
      isWeekend: isWeekend(dow),
      dayOfWeek: dow,
    });
  }

  // Next month overflow — fill to complete last row (total should be multiple of 7)
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let date = 1; date <= remaining; date++) {
      const dow = new Date(nextYear, nextMonth, date).getDay();
      days.push({
        date,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isToday: isToday(nextYear, nextMonth, date),
        isWeekend: isWeekend(dow),
        dayOfWeek: dow,
      });
    }
  }

  return days;
}

export function isSameDay(a: CalendarDay, b: CalendarDay): boolean {
  return a.date === b.date && a.month === b.month && a.year === b.year;
}

export function compareDays(a: CalendarDay, b: CalendarDay): number {
  const dateA = new Date(a.year, a.month, a.date).getTime();
  const dateB = new Date(b.year, b.month, b.date).getTime();
  return dateA - dateB;
}

export function isDayInRange(
  day: CalendarDay,
  start: CalendarDay | null,
  end: CalendarDay | null
): boolean {
  if (!start || !end) return false;
  const d = new Date(day.year, day.month, day.date).getTime();
  const s = new Date(start.year, start.month, start.date).getTime();
  const e = new Date(end.year, end.month, end.date).getTime();
  return d > s && d < e;
}

export function formatDateLabel(day: CalendarDay): string {
  const date = new Date(day.year, day.month, day.date);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatMonthDay(day: CalendarDay): string {
  const date = new Date(day.year, day.month, day.date);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function getRangeKey(start: CalendarDay, end: CalendarDay): string {
  const s = `${start.year}-${String(start.month + 1).padStart(2, "0")}-${String(start.date).padStart(2, "0")}`;
  const e = `${end.year}-${String(end.month + 1).padStart(2, "0")}-${String(end.date).padStart(2, "0")}`;
  return `${s}-${e}`;
}
