import React from "react"

export default function CheckedDocumentIcon({
  width = "32",
  height = "32",
  color = "white",
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
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M8.00016 29.3334C7.29292 29.3334 6.61464 29.0525 6.11454 28.5524C5.61445 28.0523 5.3335 27.374 5.3335 26.6668V5.33342C5.3335 4.62617 5.61445 3.9479 6.11454 3.4478C6.61464 2.9477 7.29292 2.66675 8.00016 2.66675H18.6668C19.0889 2.66607 19.5069 2.74889 19.8969 2.91044C20.2868 3.072 20.6409 3.3091 20.9388 3.60809L25.7228 8.39209C26.0226 8.69009 26.2604 9.04455 26.4224 9.43497C26.5844 9.82539 26.6675 10.244 26.6668 10.6668V26.6668C26.6668 27.374 26.3859 28.0523 25.8858 28.5524C25.3857 29.0525 24.7074 29.3334 24.0002 29.3334H8.00016Z"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.6665 2.66675V9.33341C18.6665 9.68704 18.807 10.0262 19.057 10.2762C19.3071 10.5263 19.6462 10.6667 19.9998 10.6667H26.6665"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 19.9999L14.6667 22.6666L20 17.3333"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
