import { SVGProps } from "react"

export interface EyeIconProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function EyeIcon({
  strokeColor = "#9810FA",
  width = 28,
  height = 28,
  ...props
}: EyeIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14 5.83337C9.33333 5.83337 5.25 8.75004 3.5 12.8334C5.25 16.9167 9.33333 19.8334 14 19.8334C18.6667 19.8334 22.75 16.9167 24.5 12.8334C22.75 8.75004 18.6667 5.83337 14 5.83337Z"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 16.3334C15.4728 16.3334 16.6667 15.1395 16.6667 13.6667C16.6667 12.1939 15.4728 11 14 11C12.5272 11 11.3333 12.1939 11.3333 13.6667C11.3333 15.1395 12.5272 16.3334 14 16.3334Z"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
