import { SVGProps } from "react"

export interface BadgeProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function Badge({
  strokeColor = "white",
  width = 32,
  height = 32,
  ...props
}: BadgeProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20.636 17.1866L22.656 28.5546C22.6786 28.6885 22.6598 28.8261 22.6021 28.949C22.5445 29.0719 22.4506 29.1742 22.3332 29.2424C22.2158 29.3105 22.0804 29.3412 21.945 29.3303C21.8097 29.3193 21.681 29.2674 21.576 29.1813L16.8026 25.5986C16.5722 25.4265 16.2923 25.3335 16.0046 25.3335C15.717 25.3335 15.4371 25.4265 15.2066 25.5986L10.4253 29.18C10.3204 29.2659 10.1918 29.3178 10.0566 29.3287C9.92148 29.3396 9.7862 29.3091 9.66886 29.2411C9.55151 29.1732 9.45767 29.0711 9.39987 28.9484C9.34206 28.8258 9.32302 28.6884 9.34531 28.5546L11.364 17.1866"
        stroke={strokeColor}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 18.6666C20.4183 18.6666 24 15.0849 24 10.6666C24 6.24835 20.4183 2.66663 16 2.66663C11.5817 2.66663 8 6.24835 8 10.6666C8 15.0849 11.5817 18.6666 16 18.6666Z"
        stroke={strokeColor}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
