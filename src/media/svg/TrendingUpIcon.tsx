import { SVGProps } from "react"

export interface TrendingUpIconProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function TrendingUpIcon({
  strokeColor = "white",
  width = 28,
  height = 28,
  ...props
}: TrendingUpIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M23 6L13.5 15.5L8.5 10.5L1 18"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 6H23V12"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
