import React from "react"

export default function BoxIcon({
  width = "24",
  height = "24",
  color = "#155DFC",
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
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M21 16V8C20.9996 7.64927 20.9048 7.30532 20.7248 7.00106C20.5448 6.6968 20.2856 6.44246 19.9723 6.2626L13.9723 2.2626C13.3743 1.86407 12.6257 1.86407 12.0277 2.2626L6.02773 6.2626C5.71442 6.44246 5.45518 6.6968 5.27518 7.00106C5.09518 7.30532 5.00043 7.64927 5 8V16C5.00043 16.3507 5.09518 16.6947 5.27518 16.9989C5.45518 17.3032 5.71442 17.5575 6.02773 17.7374L12.0277 21.7374C12.6257 22.1359 13.3743 22.1359 13.9723 21.7374L19.9723 17.7374C20.2856 17.5575 20.5448 17.3032 20.7248 16.9989C20.9048 16.6947 20.9996 16.3507 21 16Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.42004 6.66003L12 11.04M12 11.04L18.58 6.66003M12 11.04V22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
