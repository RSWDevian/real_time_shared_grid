"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { themes, gridConfig } from "../lib/themes";
import { CellState } from "../lib/types";
import { Cell } from "./Cell";
import { useMounted } from "../lib/useMounted";

const MOCK_USER = {
  id: "user_1",
  color: "#6366f1",
};

export default function Grid() {
  const mounted = useMounted();
  const { theme } = useTheme();

  const currentTheme = theme === "dark" ? themes.dark : themes.light;

  const [cols, setCols] = useState(gridConfig.cols);
  const [cells, setCells] = useState<CellState[]>(
    Array(gridConfig.rows * gridConfig.cols).fill(null)
  );

  useEffect(() => {
    function updateCols() {
      const padding = 32; // matches outer padding (p-4)
      const cellWithGap = gridConfig.cellSize + gridConfig.gap;
      const maxCols = Math.max(
        1,
        Math.floor((window.innerWidth - padding) / cellWithGap)
      );

      setCols(maxCols);
      setCells(Array(gridConfig.rows * maxCols).fill(null));
    }

    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  if (!mounted) return null;

  function handleCellClick(index: number) {
    setCells((prev) => {
      if (prev[index]) return prev;

      const next = [...prev];
      next[index] = {
        userId: MOCK_USER.id,
        color: MOCK_USER.color,
      };

      return next;
    });
  }

  return (
    <div
      className="p-4 rounded-xl shadow-xl transition-colors"
      style={{ background: currentTheme.gridBackground }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${gridConfig.cellSize}px)`,
          gap: gridConfig.gap,
        }}
      >
        {cells.map((owner, index) => (
          <Cell
            key={index}
            owner={owner}
            onClick={() => handleCellClick(index)}
          />
        ))}
      </div>
    </div>
  );
}