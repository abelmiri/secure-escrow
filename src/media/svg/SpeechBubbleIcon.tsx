import React from "react";

export default function SpeechBubbleIcon({
  width = "64",
  height = "64",
  color = "#155DFC",
  className = "",
  style,
}: {
  width?: string;
  height?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M32 60C47.464 60 60 47.464 60 32C60 16.536 47.464 4 32 4C16.536 4 4 16.536 4 32C4 39.1 6.6 45.6 11 50.5L8 58L17 55.5C21.3 58.4 26.4 60 32 60Z"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

