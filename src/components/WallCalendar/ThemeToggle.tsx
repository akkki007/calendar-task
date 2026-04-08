"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Theme } from "@/lib/types";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      type="button"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg"
      style={{
        backgroundColor: theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)",
      }}
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.15 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun size={18} style={{ color: "var(--text-primary)" }} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon size={18} style={{ color: "var(--text-primary)" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
