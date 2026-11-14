import { SVGProps } from "react"

interface ShieldCheckIconProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function ShieldCheckIcon({
  strokeColor = "white",
  ...props
}: ShieldCheckIconProps) {
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
      <path
        fill="none"
        d="M12 3l7.5 3v5.5c0 4.4-3.1 7.9-7.5 9.5-4.4-1.6-7.5-5.1-7.5-9.5V6z"
      />
      <path d="M8.6 12l2.4 2.4 4.4-4.8" />
    </svg>
  )
}
