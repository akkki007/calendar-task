"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { CalendarNote } from "@/lib/types";
import { NOTES_DEBOUNCE_MS } from "@/lib/constants";

const STORAGE_KEY = "wall-calendar-notes";

function loadNotes(): CalendarNote[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: CalendarNote[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // storage full or unavailable
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [hasLoadedNotes, setHasLoadedNotes] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load notes from storage after mount to keep server/client initial render consistent.
  useEffect(() => {
    setNotes(loadNotes());
    setHasLoadedNotes(true);
  }, []);

  // Persist on changes (debounced)
  useEffect(() => {
    if (!hasLoadedNotes) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveNotes(notes);
    }, NOTES_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [notes, hasLoadedNotes]);

  const getNote = useCallback(
    (monthKey: string, rangeKey?: string): CalendarNote | undefined => {
      return notes.find(
        (n) => n.monthKey === monthKey && n.rangeKey === (rangeKey ?? undefined)
      );
    },
    [notes]
  );

  const upsertNote = useCallback(
    (monthKey: string, content: string, rangeKey?: string) => {
      setNotes((prev) => {
        const idx = prev.findIndex(
          (n) =>
            n.monthKey === monthKey && n.rangeKey === (rangeKey ?? undefined)
        );

        if (content.trim() === "") {
          // Remove empty notes
          if (idx !== -1) {
            return prev.filter((_, i) => i !== idx);
          }
          return prev;
        }

        const note: CalendarNote = {
          id: rangeKey ? `${monthKey}-${rangeKey}` : monthKey,
          monthKey,
          rangeKey,
          content,
          updatedAt: Date.now(),
        };

        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = note;
          return updated;
        }

        return [...prev, note];
      });
    },
    []
  );

  const hasNoteForDay = useCallback(
    (monthKey: string, dayDate: number): boolean => {
      return notes.some((n) => {
        if (n.monthKey !== monthKey) return false;
        if (!n.rangeKey) return true; // monthly note
        // Check if day falls within range
        const parts = n.rangeKey.split("-");
        if (parts.length >= 6) {
          const startDay = parseInt(parts[2]);
          const endDay = parseInt(parts[5]);
          return dayDate >= startDay && dayDate <= endDay;
        }
        return false;
      });
    },
    [notes]
  );

  return { notes, getNote, upsertNote, hasNoteForDay };
}
