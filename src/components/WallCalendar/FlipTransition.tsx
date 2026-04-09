"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavigationDirection } from "@/lib/types";

interface FlipTransitionProps {
  transitionKey: string;
  direction: NavigationDirection;
  children: ReactNode;
}

const DURATION = 0.7;
const EASE = [0.4, 0.0, 0.2, 1.0] as const;

export default function FlipTransition({
  transitionKey,
  direction,
  children,
}: FlipTransitionProps) {
  return (
    <div
      style={{ perspective: 1800, perspectiveOrigin: "top center" }}
      className="relative"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={transitionKey}
          style={{
            transformOrigin: "top center",
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
          }}
          initial={{
            rotateX: direction === "forward" ? 90 : -90,
            opacity: 0,
            scale: 0.97,
          }}
          animate={{
            rotateX: 0,
            opacity: 1,
            scale: 1,
            transition: {
              rotateX: { duration: DURATION, ease: EASE },
              opacity: { duration: DURATION * 0.5, ease: "easeOut" },
              scale: { duration: DURATION, ease: EASE },
            },
          }}
          exit={{
            rotateX: direction === "forward" ? -120 : 120,
            opacity: 0,
            scale: 0.97,
            transition: {
              rotateX: { duration: DURATION, ease: EASE },
              opacity: { duration: DURATION * 0.6, delay: DURATION * 0.2, ease: "easeIn" },
              scale: { duration: DURATION, ease: EASE },
            },
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
