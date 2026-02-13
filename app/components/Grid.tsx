import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { themes } from "../lib/themes";
import { CellState } from "../lib/types";
import { Cell } from "./Cell";
import { useMounted } from "../lib/useMounted";
import { ROWS, COLS } from "./grid.constants";
import io, { Socket } from "socket.io-client";

type User = {
  id: string;
  email: string;
} | null;

type GridBlock = {
  blockId: string;
  occupied: boolean;
  owner: string | null;
};

let socket: Socket;

function toBlockId(row: number, col: number) {
  return `${row}-${col}`;
}

function fromBlockId(blockId: string) {
  const [row, col] = blockId.split("-").map(Number);
  return { row, col };
}

export default function Grid() {
  const mounted = useMounted();
  const { theme } = useTheme();

  const currentTheme = theme === "dark" ? themes.dark : themes.light;

  const [cellStates, setCellStates] = useState<Record<string, CellState>>({});
  const [user, setUser] = useState<User>(null);

  // Fetch current user
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    socket = io();

    // Request initial grid state
    socket.emit("request-grid");

    // Listen for initial grid state
    socket.on("grid-state", (blocks: GridBlock[]) => {
      const stateMap: Record<string, CellState> = {};
      blocks.forEach((block) => {
        stateMap[block.blockId] = block.occupied && block.owner
          ? { userId: "", email: block.owner }
          : null;
      });
      setCellStates(stateMap);
    });

    // Listen for real-time block updates
    socket.on("block-updated", (block: GridBlock) => {
      setCellStates((prev) => ({
        ...prev,
        [block.blockId]: block.occupied && block.owner
          ? { userId: "", email: block.owner }
          : null,
      }));
    });

    // Listen for errors
    socket.on("error", (error: { message: string }) => {
      alert(error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!mounted) return null;

  async function handleBook(row: number, col: number) {
    if (!user) {
      alert("Please login to book a cell.");
      return;
    }

    const blockId = toBlockId(row, col);
    socket.emit("book-block", { blockId, userEmail: user.email });
  }

  async function handleSell(row: number, col: number) {
    if (!user) return;

    const blockId = toBlockId(row, col);
    socket.emit("sell-block", { blockId, userEmail: user.email });
  }

  // Generate grid cells
  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const blockId = toBlockId(row, col);
      const cellState = cellStates[blockId] || null;
      
      cells.push(
        <Cell
          key={blockId}
          owner={cellState}
          currentUserEmail={user?.email ?? ""}
          onBook={() => handleBook(row, col)}
          onSell={() => handleSell(row, col)}
        />
      );
    }
  }

  return (
    <div
      className="p-4 rounded-xl shadow-xl transition-colors"
      style={{ background: currentTheme.gridBackground }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 30px)`,
          gap: 2,
        }}
      >
        {cells}
      </div>
    </div>
  );
}