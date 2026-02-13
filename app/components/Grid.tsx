import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { themes, gridConfig } from "../lib/themes";
import { CellState } from "../lib/types";
import { Cell } from "./Cell";
import { useMounted } from "../lib/useMounted";

// 
type User = {
  id: string;
  email: string;
} | null;

function toBlockId(index: number, cols: number) {
  const row = Math.floor(index / cols);
  const col = index % cols;
  return `${row}-${col}`;
}

export default function Grid() {
  const mounted = useMounted();
  const { theme } = useTheme();

  const currentTheme = theme === "dark" ? themes.dark : themes.light;

  const [cols, setCols] = useState(gridConfig.cols);
  const [cells, setCells] = useState<CellState[]>(
    Array(gridConfig.rows * gridConfig.cols).fill(null)
  );
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    function updateCols() {
      const padding = 32;
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

  async function handleBook(index: number) {
    if (!user) {
      alert("Please login to book a cell.");
      return;
    }

    if (cells[index]) return;

    const blockId = toBlockId(index, cols);

    const res = await fetch("/api/cells/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockId }),
    });

    if (!res.ok) return;

    setCells((prev) => {
      const next = [...prev];
      next[index] = { userId: user.id, email: user.email };
      return next;
    });
  }

  async function handleSell(index: number) {
    if (!user) return;

    const blockId = toBlockId(index, cols);

    const res = await fetch("/api/auth/cells/sell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockId }),
    });

    if (!res.ok) return;

    setCells((prev) => {
      const next = [...prev];
      next[index] = null;
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
            currentUserEmail={user?.email ?? ""}
            onBook={() => handleBook(index)}
            onSell={() => handleSell(index)}
          />
        ))}
      </div>
    </div>
  );
}