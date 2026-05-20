import React from "react"

export default function ArrowDown({
  width = "20",
  height = "20",
  color = "#717182",
  className = "",
  style,
}: {
  width?: string
  height?: string
  color?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M0.666016 0.666992L4.66602 4.66699L8.66602 0.666992"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
