"use client";

import { useState, useCallback, useRef } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { StickyNote } from "lucide-react";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRange } from "@/hooks/useDateRange";
import { useNotes } from "@/hooks/useNotes";
import { useTheme } from "@/hooks/useTheme";
import CalendarHeader from "./CalendarHeader";
import HeroImage from "./HeroImage";
import SpiralBinding from "./SpiralBinding";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import FlipTransition from "./FlipTransition";
import MiniCalendar from "./MiniCalendar";

const SWIPE_THRESHOLD = 50;

export default function WallCalendar() {
  const {
    month,
    year,
    calendarDays,
    direction,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
  } = useCalendar();

  const {
    range,
    previewEnd,
    handleDayClick,
    handleDayHover,
    clearSelection,
  } = useDateRange();

  const { getNote, upsertNote, hasNoteForDay } = useNotes();
  const { theme, toggleTheme } = useTheme();

  const [mobileNotesOpen, setMobileNotesOpen] = useState(false);
  const swipeControls = useAnimation();
  const calendarRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation within the grid
  const handleKeyNavigation = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        clearSelection();
        return;
      }

      const target = e.target as HTMLElement;
      const gridCells = calendarRef.current?.querySelectorAll(
        '[role="gridcell"]'
      );
      if (!gridCells) return;

      const cellsArray = Array.from(gridCells) as HTMLElement[];
      const currentIdx = cellsArray.indexOf(target);
      if (currentIdx === -1) return;

      let nextIdx = currentIdx;

      switch (e.key) {
        case "ArrowRight":
          nextIdx = Math.min(currentIdx + 1, cellsArray.length - 1);
          break;
        case "ArrowLeft":
          nextIdx = Math.max(currentIdx - 1, 0);
          break;
        case "ArrowDown":
          nextIdx = Math.min(currentIdx + 7, cellsArray.length - 1);
          break;
        case "ArrowUp":
          nextIdx = Math.max(currentIdx - 7, 0);
          break;
        default:
          return;
      }

      e.preventDefault();
      cellsArray[nextIdx]?.focus();
    },
    [clearSelection]
  );

  // Swipe gesture handler
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
        if (info.offset.x < 0) {
          goToNextMonth();
        } else {
          goToPrevMonth();
        }
      }
      swipeControls.start({ x: 0 });
    },
    [goToNextMonth, goToPrevMonth, swipeControls]
  );

  // Previous/next month for mini calendars
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  return (
    <div className="flex w-full max-w-[1200px] flex-col lg:flex-row" ref={calendarRef}>
      {/* Notes Panel — left on desktop, bottom drawer on mobile */}
      <NotesPanel
        month={month}
        year={year}
        rangeStart={range.start}
        rangeEnd={range.end}
        getNote={getNote}
        upsertNote={upsertNote}
        isMobileOpen={mobileNotesOpen}
        onMobileClose={() => setMobileNotesOpen(false)}
      />

      {/* Main Calendar Card */}
      <div className="relative flex-1 lg:rounded-l-none">
        {/* Spiral Binding — sits at the very top, overlapping the card */}
        <SpiralBinding />

        {/* Calendar card body below the spiral */}
        <div
          className="paper-texture relative overflow-hidden rounded-b-xl shadow-lg"
          style={{
            backgroundColor: "var(--bg-calendar)",
            boxShadow: `
              0 4px 6px -1px var(--shadow-color),
              0 10px 15px -3px var(--shadow-color),
              0 20px 40px -4px var(--shadow-color)
            `,
          }}
        >
          {/* Swipeable area wrapping Hero Image */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            animate={swipeControls}
            className="touch-pan-y"
          >
            {/* Hero Image with flip transition */}
            <FlipTransition
              transitionKey={`${month}-${year}`}
              direction={direction}
            >
              <HeroImage month={month} year={year} />
            </FlipTransition>
          </motion.div>

          {/* Header — between image and grid */}
          <CalendarHeader
            month={month}
            year={year}
            direction={direction}
            theme={theme}
            onPrev={goToPrevMonth}
            onNext={goToNextMonth}
            onToday={goToToday}
            onToggleTheme={toggleTheme}
          />

          {/* Calendar Grid */}
          <CalendarGrid
            days={calendarDays}
            month={month}
            year={year}
            rangeStart={range.start}
            rangeEnd={range.end}
            previewEnd={previewEnd}
            hasNoteForDay={hasNoteForDay}
            onDayClick={handleDayClick}
            onDayHover={handleDayHover}
            onKeyNavigation={handleKeyNavigation}
          />

          {/* Mini calendars footer */}
          <div
            className="hidden items-center justify-between gap-4 px-5 py-4 sm:flex"
            style={{ borderTop: "1px solid color-mix(in srgb, var(--border-color) 50%, transparent)" }}
          >
            <MiniCalendar month={prevMonth} year={prevYear} label="Previous" />
            <MiniCalendar month={nextMonth} year={nextYear} label="Next" />
          </div>
        </div>
      </div>

      {/* Mobile floating notes button */}
      <motion.button
        type="button"
        aria-label="Open notes"
        className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full shadow-lg lg:hidden"
        style={{
          backgroundColor: "var(--accent-start)",
          color: "#FFFFFF",
        }}
        onClick={() => setMobileNotesOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <StickyNote size={20} />
      </motion.button>
    </div>
  );
}
