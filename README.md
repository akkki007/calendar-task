# Wall Calendar

An interactive, skeuomorphic wall calendar built with Next.js 16, React 19, Framer Motion, and Tailwind CSS 4.

## Design Choices

### Local Images
Month hero images are downloaded and served from `public/images/months/` instead of fetching from Unsplash at runtime. This eliminates external network latency, avoids rate-limit issues, and lets `next/image` handle optimization and caching automatically.

### Full-Page Flip Animation
Month transitions use a page-flip animation that rotates the entire calendar page (image + grid + footer) from the top edge, mimicking how a real wall calendar page turns over the spiral binding. Built with Framer Motion's `AnimatePresence` and 3D CSS transforms (`perspective`, `rotateX`, `transformOrigin: top center`).

### Physical Shadow Effect
The calendar card uses layered `box-shadow` values at increasing depths plus subtle inset highlights to simulate the look of a physical paper calendar hanging on a wall.

### Spiral Binding
An SVG-based wire spiral binding sits above the calendar card. It renders front/back coil arcs, punched paper holes, metallic gradients, and highlights that adapt to light/dark themes.

### Scaled-Down Layout
Max width is set to `900px` (down from `1200px`) so the calendar feels appropriately sized on desktop without overwhelming the viewport.

### Hydration-Safe Hooks
`useCalendar`, `useTheme`, and `useNotes` all initialize with deterministic defaults on the server, then restore from `localStorage` after mount. This avoids React hydration mismatches while still persisting user state across sessions.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Framer Motion 12 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Language | TypeScript 5 |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

```bash
npm run build   # Production build
npm run start   # Serve production build
```

## Project Structure

```
src/
  app/                  # Next.js App Router (layout, page, globals)
  components/
    WallCalendar/       # All calendar UI components
      WallCalendar.tsx    # Main orchestrator
      HeroImage.tsx       # Month hero image
      FlipTransition.tsx  # Full-page flip animation
      SpiralBinding.tsx   # SVG wire spiral
      CalendarGrid.tsx    # Day grid
      CalendarHeader.tsx  # Month/year nav + theme toggle
      NotesPanel.tsx      # Side panel / mobile drawer for notes
      MiniCalendar.tsx    # Prev/next month mini grids
  hooks/                # useCalendar, useDateRange, useNotes, useTheme
  lib/                  # Types, constants, date utilities
public/
  images/months/        # 12 locally-served hero images (one per month)
```
