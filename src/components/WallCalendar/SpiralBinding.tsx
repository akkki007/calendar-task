"use client";

import { useId, useMemo } from "react";
import { Theme } from "@/lib/types";

interface SpiralBindingProps {
  theme: Theme;
}

export default function SpiralBinding({ theme }: SpiralBindingProps) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");

  const spiralCount = 17;
  const spacing = 44;
  const totalWidth = spiralCount * spacing;
  const viewHeight = 52;
  const midY = viewHeight / 2;
  const coilRx = 6.25;
  const coilRy = 14.5;
  const paperHalf = 3.5;
  const underY = midY + paperHalf + 4;

  const centers = useMemo(
    () => Array.from({ length: spiralCount }, (_, i) => i * spacing + spacing / 2),
    [spiralCount, spacing]
  );

  /** Lower semicircle (wire behind paper): east → west, bulges downward */
  const bottomArc = (cx: number) =>
    `M ${cx + coilRx} ${midY} A ${coilRx} ${coilRy} 0 0 1 ${cx - coilRx} ${midY}`;

  /** Upper semicircle (wire in front): west → east, bulges upward */
  const topArc = (cx: number) =>
    `M ${cx - coilRx} ${midY} A ${coilRx} ${coilRy} 0 0 1 ${cx + coilRx} ${midY}`;

  /** Hidden run between coil i (left exit) and coil i+1 (right entry) */
  const underConnector = (fromCx: number, toCx: number) => {
    const x0 = fromCx - coilRx;
    const x1 = toCx + coilRx;
    return `C ${x0 + coilRx * 0.35} ${underY} ${x1 - coilRx * 0.35} ${underY} ${x1} ${midY}`;
  };

  const behindPath = useMemo(() => {
    const parts: string[] = [];
    const c0 = centers[0];
    parts.push(`M ${c0 + coilRx} ${midY}`);
    parts.push(bottomArc(c0).replace(/^M \S+ \S+ /, ""));
    for (let i = 0; i < spiralCount - 1; i++) {
      parts.push(underConnector(centers[i], centers[i + 1]));
      parts.push(bottomArc(centers[i + 1]).replace(/^M \S+ \S+ /, ""));
    }
    const last = centers[spiralCount - 1];
    parts.push(
      `C ${last - coilRx * 0.4} ${underY + 2} ${totalWidth - 4} ${underY} ${totalWidth} ${midY + 1}`
    );
    return parts.join(" ");
  }, [centers, spiralCount, totalWidth]);

  const frontPath = useMemo(() => {
    return centers.map((cx) => topArc(cx)).join(" ");
  }, [centers]);

  const highlightPath = useMemo(() => {
    return centers
      .map((cx, i) => {
        const alt = i % 2 === 0 ? 0 : 0.4;
        const rx = coilRx - 1.2;
        const ry = coilRy - 3.5;
        return `M ${cx - rx + alt} ${midY - 1.2} A ${rx} ${ry} 0 0 1 ${cx + rx - alt} ${midY - 1.2}`;
      })
      .join(" ");
  }, [centers]);

  const wireGrad = theme === "dark" ? `wire-dark-${uid}` : `wire-${uid}`;
  const wireGradHi = theme === "dark" ? `wire-hi-dark-${uid}` : `wire-hi-${uid}`;

  return (
    <div
      className="relative z-10 flex items-center justify-center"
      aria-hidden="true"
      style={{ marginBottom: -6 }}
    >
      <svg
        viewBox={`0 0 ${totalWidth} ${viewHeight}`}
        className="w-full h-10 md:h-12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient
            id={`wire-${uid}`}
            x1="0"
            y1="0"
            x2={totalWidth}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#7A7A7A" />
            <stop offset="22%" stopColor="#C8C8C8" />
            <stop offset="45%" stopColor="#F2F2F2" />
            <stop offset="55%" stopColor="#D4D4D4" />
            <stop offset="78%" stopColor="#9A9A9A" />
            <stop offset="100%" stopColor="#6E6E6E" />
          </linearGradient>
          <linearGradient
            id={`wire-dark-${uid}`}
            x1="0"
            y1="0"
            x2={totalWidth}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#3D3D3D" />
            <stop offset="25%" stopColor="#6A6A6A" />
            <stop offset="50%" stopColor="#8F8F8F" />
            <stop offset="75%" stopColor="#5C5C5C" />
            <stop offset="100%" stopColor="#383838" />
          </linearGradient>
          <linearGradient id={`wire-hi-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`wire-hi-dark-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8E8E8" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`paper-edge-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bg-calendar)" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--bg-calendar) 88%, var(--border-color))" />
          </linearGradient>
          <filter id={`spiral-shadow-${uid}`} x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="1.25" stdDeviation="0.9" floodColor="#000000" floodOpacity="0.18" />
            <feDropShadow dx="0" dy="0.5" stdDeviation="0.35" floodColor="#000000" floodOpacity="0.08" />
          </filter>
          <filter id={`hole-inner-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0.8" stdDeviation="0.6" floodColor="#000000" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Continuous wire behind the sheet (bottom loops + runs under the binding edge) */}
        <path
          d={behindPath}
          stroke={theme === "dark" ? "#4A4A4A" : "#8E8E8E"}
          strokeWidth={2.15}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={theme === "dark" ? 0.45 : 0.38}
        />

        {/* Paper / card edge */}
        <rect
          x="0"
          y={midY - paperHalf}
          width={totalWidth}
          height={paperHalf * 2}
          fill={`url(#paper-edge-${uid})`}
          stroke="var(--border-color)"
          strokeWidth="0.45"
        />

        {/* Punched slots (elongated, like real calendar binding) */}
        {centers.map((cx, i) => (
          <g key={`hole-${i}`} filter={`url(#hole-inner-${uid})`}>
            <ellipse
              cx={cx}
              cy={midY}
              rx={5.25}
              ry={4.35}
              fill="var(--bg-page)"
              stroke="var(--border-color)"
              strokeWidth="0.35"
              opacity={0.92}
            />
            <ellipse
              cx={cx}
              cy={midY + 0.35}
              rx={4.4}
              ry={3.5}
              fill="none"
              stroke="color-mix(in srgb, var(--border-color) 55%, transparent)"
              strokeWidth="0.25"
              opacity={0.5}
            />
          </g>
        ))}

        {/* Front wire: one stroke per coil so caps sit at the sheet (continuous look where visible) */}
        <path
          d={frontPath}
          stroke={`url(#${wireGrad})`}
          strokeWidth={2.35}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#spiral-shadow-${uid})`}
        />
        <path
          d={frontPath}
          stroke={`url(#${wireGradHi})`}
          strokeWidth={1.15}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.85}
        />

        <path
          d={highlightPath}
          stroke="white"
          strokeWidth={0.65}
          strokeLinecap="round"
          opacity={theme === "dark" ? 0.18 : 0.38}
        />
      </svg>
    </div>
  );
}
