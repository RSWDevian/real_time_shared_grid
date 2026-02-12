"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { themes, gridConfig } from "../lib/themes"
import { TOTAL_CELLS } from "./grid.constants"
import { CellState } from "../lib/types"
import { Cell } from "./Cell"
import { useMounted } from "../lib/useMounted"

const MOCK_USER = {
    id: "user_1",
    color: "#6366f1", // indigo-500
};

export default function Grid() {
    const mounted = useMounted()
    const { theme } = useTheme()
    
    const currentTheme = theme === "dark" ? themes.dark : themes.light
    const [cells, setCells] = useState<CellState[]>(
        Array(TOTAL_CELLS).fill(null)
    )

    if (!mounted) return null

    function handleCellClick(index: number) {
        setCells((prev) => {
            if (prev[index]) return prev; // already owned

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
          gridTemplateColumns: `repeat(${gridConfig.cols}, ${gridConfig.cellSize}px)`,
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