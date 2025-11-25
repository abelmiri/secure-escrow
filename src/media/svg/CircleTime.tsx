import { SVGProps } from "react"

export interface CircleTimeProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function CircleTime({
  strokeColor = "white",
  width = 28,
  height = 28,
  ...props
}: CircleTimeProps) {
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
        d="M14 7V14L18.6667 16.3333"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 25.6666C20.4433 25.6666 25.6666 20.4432 25.6666 13.9999C25.6666 7.5566 20.4433 2.33325 14 2.33325C7.55666 2.33325 2.33331 7.5566 2.33331 13.9999C2.33331 20.4432 7.55666 25.6666 14 25.6666Z"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
