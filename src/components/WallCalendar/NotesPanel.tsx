"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, X, FileText } from "lucide-react";
import { CalendarDay } from "@/lib/types";
import { getMonthKey, getRangeKey, formatMonthDay } from "@/lib/dateUtils";
import { MONTH_NAMES, MAX_NOTE_LENGTH } from "@/lib/constants";

interface NotesPanelProps {
  month: number;
  year: number;
  rangeStart: CalendarDay | null;
  rangeEnd: CalendarDay | null;
  getNote: (monthKey: string, rangeKey?: string) => { content: string } | undefined;
  upsertNote: (monthKey: string, content: string, rangeKey?: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function NotesPanel({
  month,
  year,
  rangeStart,
  rangeEnd,
  getNote,
  upsertNote,
  isMobileOpen,
  onMobileClose,
}: NotesPanelProps) {
  const monthKey = getMonthKey(year, month);
  const rangeKey =
    rangeStart && rangeEnd ? getRangeKey(rangeStart, rangeEnd) : undefined;

  const monthNote = getNote(monthKey);
  const [monthText, setMonthText] = useState(monthNote?.content ?? "");

  const rangeNote = rangeKey ? getNote(monthKey, rangeKey) : undefined;
  const [rangeText, setRangeText] = useState(rangeNote?.content ?? "");

  useEffect(() => {
    setMonthText(monthNote?.content ?? "");
  }, [monthKey, monthNote?.content]);

  useEffect(() => {
    setRangeText(rangeNote?.content ?? "");
  }, [rangeKey, rangeNote?.content]);

  const handleMonthChange = useCallback(
    (value: string) => {
      if (value.length > MAX_NOTE_LENGTH) return;
      setMonthText(value);
      upsertNote(monthKey, value);
    },
    [monthKey, upsertNote]
  );

  const handleRangeChange = useCallback(
    (value: string) => {
      if (value.length > MAX_NOTE_LENGTH || !rangeKey) return;
      setRangeText(value);
      upsertNote(monthKey, value, rangeKey);
    },
    [monthKey, rangeKey, upsertNote]
  );

  const content = (
    <div
      role="region"
      aria-label="Notes"
      className="flex h-full flex-col"
    >
      {/* Mobile header */}
      <div
        className="flex items-center justify-between px-5 py-4 lg:hidden"
        style={{ borderBottom: "1px solid color-mix(in srgb, var(--border-color) 50%, transparent)" }}
      >
        <div className="flex items-center gap-2.5">
          <StickyNote size={16} style={{ color: "var(--accent-start)" }} />
          <h3
            className="text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Notes
          </h3>
        </div>
        <button
          type="button"
          aria-label="Close notes"
          onClick={onMobileClose}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ color: "var(--text-secondary)", backgroundColor: "color-mix(in srgb, var(--border-color) 30%, transparent)" }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Desktop header */}
      <div
        className="hidden items-center gap-2.5 px-5 py-4 lg:flex"
        style={{ borderBottom: "1px solid color-mix(in srgb, var(--border-color) 50%, transparent)" }}
      >
        <StickyNote size={16} style={{ color: "var(--accent-start)" }} />
        <h3
          className="text-sm font-semibold tracking-wide"
          style={{ color: "var(--text-primary)" }}
        >
          Notes
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Range note section */}
        {rangeStart && rangeEnd && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText size={13} style={{ color: "var(--accent-start)" }} />
              <label
                className="text-xs font-semibold"
                style={{ color: "var(--accent-start)" }}
              >
                {formatMonthDay(rangeStart)} – {formatMonthDay(rangeEnd)}
              </label>
            </div>
            <div className="relative">
              <textarea
                value={rangeText}
                onChange={(e) => handleRangeChange(e.target.value)}
                placeholder="Add notes for this range..."
                className="h-28 w-full resize-none rounded-lg p-3 text-sm leading-6 outline-none transition-shadow duration-200"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--bg-calendar) 60%, var(--bg-notes))",
                  border: "1px solid color-mix(in srgb, var(--border-color) 40%, transparent)",
                  color: "var(--text-primary)",
                  boxShadow: "inset 0 1px 2px color-mix(in srgb, var(--shadow-color) 50%, transparent)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent-start)";
                  e.currentTarget.style.boxShadow = "0 0 0 2px color-mix(in srgb, var(--accent-start) 15%, transparent)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "color-mix(in srgb, var(--border-color) 40%, transparent)";
                  e.currentTarget.style.boxShadow = "inset 0 1px 2px color-mix(in srgb, var(--shadow-color) 50%, transparent)";
                }}
                maxLength={MAX_NOTE_LENGTH}
              />
              <span
                className="absolute bottom-2 right-3 text-[10px] tabular-nums"
                style={{ color: "var(--text-secondary)", opacity: 0.6 }}
              >
                {rangeText.length}/{MAX_NOTE_LENGTH}
              </span>
            </div>
          </div>
        )}

        {/* Monthly note section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText size={13} style={{ color: "var(--text-secondary)" }} />
            <label
              className="text-xs font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              {MONTH_NAMES[month]} {year}
            </label>
          </div>
          <div className="relative">
            <textarea
              value={monthText}
              onChange={(e) => handleMonthChange(e.target.value)}
              placeholder="Monthly notes..."
              className="h-36 w-full resize-none rounded-lg p-3 text-sm leading-6 outline-none transition-shadow duration-200"
              style={{
                backgroundColor: "color-mix(in srgb, var(--bg-calendar) 60%, var(--bg-notes))",
                border: "1px solid color-mix(in srgb, var(--border-color) 40%, transparent)",
                color: "var(--text-primary)",
                boxShadow: "inset 0 1px 2px color-mix(in srgb, var(--shadow-color) 50%, transparent)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-start)";
                e.currentTarget.style.boxShadow = "0 0 0 2px color-mix(in srgb, var(--accent-start) 15%, transparent)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "color-mix(in srgb, var(--border-color) 40%, transparent)";
                e.currentTarget.style.boxShadow = "inset 0 1px 2px color-mix(in srgb, var(--shadow-color) 50%, transparent)";
              }}
              maxLength={MAX_NOTE_LENGTH}
            />
            <span
              className="absolute bottom-2 right-3 text-[10px] tabular-nums"
              style={{ color: "var(--text-secondary)", opacity: 0.6 }}
            >
              {monthText.length}/{MAX_NOTE_LENGTH}
            </span>
          </div>
        </div>

        {/* Empty state when no range selected */}
        {!rangeStart && !rangeEnd && !monthText && (
          <div className="flex flex-col items-center justify-center py-6 opacity-40">
            <StickyNote size={28} style={{ color: "var(--text-secondary)" }} />
            <p className="mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              Select dates to add range notes
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <div
        className="hidden lg:flex lg:w-[260px] mt-10 lg:flex-shrink-0 lg:flex-col rounded-l-xl overflow-hidden"
        style={{
          backgroundColor: "var(--bg-notes)",
          borderRight: "1px solid color-mix(in srgb, var(--border-color) 50%, transparent)",
          boxShadow: "inset -1px 0 0 color-mix(in srgb, var(--shadow-color) 30%, transparent)",
        }}
      >
        {content}
      </div>

      {/* Mobile: bottom drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 h-[70vh] rounded-t-2xl lg:hidden"
              style={{
                backgroundColor: "var(--bg-notes)",
                boxShadow: "0 -4px 30px rgba(0,0,0,0.15)",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div
                  className="h-1 w-10 rounded-full"
                  style={{ backgroundColor: "var(--border-color)", opacity: 0.6 }}
                />
              </div>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
