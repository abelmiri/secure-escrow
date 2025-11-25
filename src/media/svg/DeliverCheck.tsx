import { SVGProps } from "react"

export interface DeliverCheckProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function DeliverCheck({
  strokeColor = "white",
  width = 32,
  height = 32,
  ...props
}: DeliverCheckProps) {
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
        d="M29.068 13.3333C29.6769 16.3217 29.2429 19.4285 27.8384 22.1357C26.4339 24.8429 24.1438 26.9867 21.35 28.2097C18.5561 29.4328 15.4275 29.661 12.4857 28.8565C9.54391 28.0519 6.96687 26.2632 5.18432 23.7885C3.40176 21.3139 2.52145 18.303 2.69017 15.2578C2.85889 12.2127 4.06646 9.31744 6.11148 7.05488C8.15651 4.79232 10.9154 3.29923 13.928 2.82459C16.9407 2.34995 20.025 2.92247 22.6666 4.44665"
        stroke={strokeColor}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.6667L16 18.6667L29.3333 5.33337"
        stroke={strokeColor}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
