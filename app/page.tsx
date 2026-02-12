// app/page.tsx
"use client";

import { useTheme } from "next-themes";
import Grid from "./components/Grid";
import { themes } from "./lib/themes";

export default function HomePage() {
  const { theme } = useTheme();
  const currentTheme = themes[theme as "dark" | "light"] ?? themes.dark;

  return (
    <main
      className="flex items-center justify-center min-h-screen transition-colors"
      style={{ background: currentTheme.background }}
    >
      <Grid />
    </main>
  );
}
