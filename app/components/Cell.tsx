"use client";

import { useTheme } from "next-themes";
import { themes, gridConfig } from "../lib/themes";
import { useState } from "react";
import { CellState } from "../lib/types";
import { useMounted } from "../lib/useMounted";

interface CellProps {
  owner: CellState;
  currentUserEmail: string;
  onBook: () => void;
  onSell: () => void;
}

export function Cell({ owner, currentUserEmail, onBook, onSell }: CellProps) {
  const mounted = useMounted();
  const { theme } = useTheme();

  const currentTheme = theme === "dark" ? themes.dark : themes.light;
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const isOwned = Boolean(owner);
  const isMine = owner?.email === currentUserEmail;

  if (!mounted) return null;

  const showTooltip = hovered || pinned;

  return (
    <div
      onClick={() => setPinned((p) => !p)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-sm"
      style={{
        width: gridConfig.cellSize,
        height: gridConfig.cellSize,
        background: hovered ? currentTheme.hover : currentTheme.cellEmpty,
        border: `1px solid ${currentTheme.cellBorder}`,
      }}
    >
      {showTooltip && (
        <div className="absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 shadow-lg">
          {!isOwned && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook();
                setPinned(false);
              }}
              className="block w-full text-left hover:text-white"
            >
              Book
            </button>
          )}

          {isOwned && isMine && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSell();
                setPinned(false);
              }}
              className="block w-full text-left hover:text-white"
            >
              Sell
            </button>
          )}

          {isOwned && !isMine && (
            <div className="whitespace-nowrap text-slate-300">
              Owner: {owner?.email}
            </div>
          )}
        </div>
      )}
    </div>
  );
}