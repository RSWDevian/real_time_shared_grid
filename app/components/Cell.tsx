"use client"

import { useTheme } from "next-themes"
import { themes, gridConfig } from "../lib/themes"
import { useState } from "react"
import { CellState } from "../lib/types"
import { useMounted } from "../lib/useMounted"

interface CellProps {
  owner: CellState;
  onClick: () => void;
}

export function Cell({ owner, onClick }: CellProps) {
    const mounted = useMounted()
    const { theme } = useTheme()
    
    const currentTheme = theme === "dark" ? themes.dark : themes.light
    const [hovered, setHovered] = useState(false)
    const isOwned = Boolean(owner)

    if (!mounted) return null

    return(
        <div
            onClick={!isOwned? onClick : undefined }
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="rounded-sm"
            style={{
                width: gridConfig.cellSize,
                height: gridConfig.cellSize,
                background: hovered? currentTheme.hover : currentTheme.cellEmpty,
                border: `1px solid ${currentTheme.cellBorder}`
            }}
        />
    )
}