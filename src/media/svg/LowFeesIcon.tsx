import { SVGProps } from "react"

interface LowFeesIconProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function LowFeesIcon({
  strokeColor = "white",
  ...props
}: LowFeesIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle fill="none" cx="8" cy="8" r="2.8" />
      <circle fill="none" cx="16" cy="16" r="2.8" />
      <path d="M18 6L6 18" />
    </svg>
  )
}
