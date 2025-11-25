import { SVGProps } from "react"

export interface LightningIconProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function LightningIcon({
  strokeColor = "white",
  width = 28,
  height = 28,
  ...props
}: LightningIconProps) {
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
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
