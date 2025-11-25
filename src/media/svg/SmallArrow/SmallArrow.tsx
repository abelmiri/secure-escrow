"use client"

import type { SmallArrowProps } from "./types"

export default function SmallArrow({
  width = 16,
  height = 16,
  className,
  strokeColor = "#8200DB",
}: SmallArrowProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.33333 8H12.6667"
        stroke={strokeColor}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 3.33331L12.6667 7.99998L8 12.6666"
        stroke={strokeColor}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
