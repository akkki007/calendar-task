"use client";

import Image from "next/image";
import { HERO_IMAGES, MONTH_NAMES } from "@/lib/constants";

interface HeroImageProps {
  month: number;
  year: number;
}

export default function HeroImage({ month, year }: HeroImageProps) {
  const src = HERO_IMAGES[month];

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
      <Image
        src={src}
        alt={`${MONTH_NAMES[month]} ${year} seasonal landscape`}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 960px"
        priority
      />
      {/* Gradient scrim at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
      {/* Month + Year overlay */}
      <div className="absolute bottom-4 right-4 text-right md:bottom-6 md:right-6">
        <h3
          className="text-xl font-bold text-white drop-shadow-lg md:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {MONTH_NAMES[month]}
        </h3>
        <span className="text-xs font-light uppercase tracking-[3px] text-white/80 md:text-sm">
          {year}
        </span>
      </div>
    </div>
  );
}
