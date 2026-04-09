export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export const HERO_IMAGES: Record<number, string> = {
  0: "/images/months/january.jpg",
  1: "/images/months/february.jpg",
  2: "/images/months/march.jpg",
  3: "/images/months/april.jpg",
  4: "/images/months/may.jpg",
  5: "/images/months/june.jpg",
  6: "/images/months/july.jpg",
  7: "/images/months/august.jpg",
  8: "/images/months/september.jpg",
  9: "/images/months/october.jpg",
  10: "/images/months/november.jpg",
  11: "/images/months/december.jpg",
};

export const MAX_NOTE_LENGTH = 500;
export const NOTES_DEBOUNCE_MS = 500;
