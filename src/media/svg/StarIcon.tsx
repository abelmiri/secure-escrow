import { SVGProps } from "react"

export interface StarIconProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function StarIcon({
  strokeColor = "white",
  width = 28,
  height = 28,
  ...props
}: StarIconProps) {
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
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
