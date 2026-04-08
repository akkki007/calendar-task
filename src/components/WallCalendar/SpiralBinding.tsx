"use client";

export default function SpiralBinding() {
  const spiralCount = 17;
  const spacing = 44;
  const totalWidth = spiralCount * spacing;
  const viewHeight = 48;

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
          {/* Metallic gradient for the wire */}
          <linearGradient id="wire-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A0A0A0" />
            <stop offset="30%" stopColor="#E8E8E8" />
            <stop offset="50%" stopColor="#D0D0D0" />
            <stop offset="70%" stopColor="#888888" />
            <stop offset="100%" stopColor="#6B6B6B" />
          </linearGradient>
          <linearGradient id="wire-gradient-dark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#555555" />
            <stop offset="30%" stopColor="#888888" />
            <stop offset="50%" stopColor="#777777" />
            <stop offset="70%" stopColor="#555555" />
            <stop offset="100%" stopColor="#404040" />
          </linearGradient>
          {/* Drop shadow for depth */}
          <filter id="spiral-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Paper edge strip — the horizontal bar the spirals thread through */}
        <rect
          x="0"
          y={viewHeight / 2 - 3}
          width={totalWidth}
          height="6"
          fill="var(--bg-calendar)"
          stroke="var(--border-color)"
          strokeWidth="0.5"
        />

        {/* Punch holes in the paper strip */}
        {Array.from({ length: spiralCount }, (_, i) => {
          const cx = i * spacing + spacing / 2;
          return (
            <ellipse
              key={`hole-${i}`}
              cx={cx}
              cy={viewHeight / 2}
              rx="5.5"
              ry="5"
              fill="var(--bg-page)"
              stroke="var(--border-color)"
              strokeWidth="0.3"
              opacity="0.6"
            />
          );
        })}

        {/* Wire spiral coils */}
        {Array.from({ length: spiralCount }, (_, i) => {
          const cx = i * spacing + spacing / 2;
          const coilRx = 7;
          const coilRy = 16;
          const topY = viewHeight / 2 - coilRy;
          const botY = viewHeight / 2 + coilRy;
          const midY = viewHeight / 2;

          return (
            <g key={`coil-${i}`} filter="url(#spiral-shadow)">
              {/* Back half of the coil (behind the paper) — drawn first */}
              <path
                d={`M ${cx - coilRx} ${midY} A ${coilRx} ${coilRy} 0 0 1 ${cx + coilRx} ${midY}`}
                stroke="url(#wire-gradient)"
                strokeWidth="2.2"
                fill="none"
                strokeLinecap="round"
                opacity="0.35"
              />

              {/* Front half of the coil (in front of the paper) — the visible loop at top */}
              <path
                d={`M ${cx + coilRx} ${midY} A ${coilRx} ${coilRy} 0 0 1 ${cx - coilRx} ${midY}`}
                stroke="url(#wire-gradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />

              {/* Bright highlight on the top of the coil */}
              <path
                d={`M ${cx + coilRx - 2} ${midY - 2} A ${coilRx - 2} ${coilRy - 4} 0 0 1 ${cx - coilRx + 2} ${midY - 2}`}
                stroke="white"
                strokeWidth="0.7"
                fill="none"
                opacity="0.4"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
