// lib/theme.ts
export const themes = {
  dark: {
    background: "#020617",
    gridBackground: "#020617",
    cellEmpty: "#020617",
    cellBorder: "#1e293b",
    hover: "#334155",
  },
  light: {
    background: "#f8fafc",
    gridBackground: "#ffffff",
    cellEmpty: "#f1f5f9",
    cellBorder: "#cbd5f5",
    hover: "#e2e8f0",
  },
};

export const gridConfig = {
  rows: 10,
  cols: 10,
  cellSize: 30,
  gap: 40,
};

export const animation = {
  fast: "150ms ease-out",
  normal: "250ms ease-out",
};
