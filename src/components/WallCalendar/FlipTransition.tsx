"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavigationDirection } from "@/lib/types";

interface FlipTransitionProps {
  transitionKey: string;
  direction: NavigationDirection;
  children: ReactNode;
}

const EASE = [0.645, 0.045, 0.355, 1.0] as const;

const flipVariants = {
  enterForward: {
    rotateX: 90,
    opacity: 0,
    transformOrigin: "top center",
  },
  enterBackward: {
    rotateX: -90,
    opacity: 0,
    transformOrigin: "bottom center",
  },
  center: {
    rotateX: 0,
    opacity: 1,
    transformOrigin: "top center",
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
  exitForward: {
    rotateX: -90,
    opacity: 0,
    transformOrigin: "top center",
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
  exitBackward: {
    rotateX: 90,
    opacity: 0,
    transformOrigin: "bottom center",
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
} as const;

export default function FlipTransition({
  transitionKey,
  direction,
  children,
}: FlipTransitionProps) {
  return (
    <div style={{ perspective: 1200 }} className="relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={transitionKey}
          variants={flipVariants}
          initial={direction === "forward" ? "enterForward" : "enterBackward"}
          animate="center"
          exit={direction === "forward" ? "exitForward" : "exitBackward"}
          style={{ backfaceVisibility: "hidden" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
