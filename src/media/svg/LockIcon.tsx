import { SVGProps } from "react"

export interface LockIconProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function LockIcon({
  strokeColor = "#9810FA",
  width = 28,
  height = 28,
  ...props
}: LockIconProps) {
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
        d="M22.1667 12.8334H5.83333C4.54467 12.8334 3.5 13.878 3.5 15.1667V23.3334C3.5 24.622 4.54467 25.6667 5.83333 25.6667H22.1667C23.4553 25.6667 24.5 24.622 24.5 23.3334V15.1667C24.5 13.878 23.4553 12.8334 22.1667 12.8334Z"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.16667 12.8334V8.16671C8.16667 6.61961 8.78125 5.13588 9.87521 4.04192C10.9692 2.94796 12.4529 2.33337 14 2.33337C15.5471 2.33337 17.0308 2.94796 18.1248 4.04192C19.2188 5.13588 19.8333 6.61961 19.8333 8.16671V12.8334"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
