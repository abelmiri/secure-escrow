import { SVGProps } from "react"

export interface ServerRacksIconProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function ServerRacksIcon({
  strokeColor = "#9810FA",
  width = 28,
  height = 28,
  ...props
}: ServerRacksIconProps) {
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
        d="M7 4.66663H21C21.5523 4.66663 22 5.11434 22 5.66663V8.33329C22 8.88558 21.5523 9.33329 21 9.33329H7C6.44772 9.33329 6 8.88558 6 8.33329V5.66663C6 5.11434 6.44772 4.66663 7 4.66663Z"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 12.8334H21C21.5523 12.8334 22 13.2811 22 13.8334V16.5C22 17.0523 21.5523 17.5 21 17.5H7C6.44772 17.5 6 17.0523 6 16.5V13.8334C6 13.2811 6.44772 12.8334 7 12.8334Z"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 21H21C21.5523 21 22 21.4477 22 22V24.6667C22 25.219 21.5523 25.6667 21 25.6667H7C6.44772 25.6667 6 25.219 6 24.6667V22C6 21.4477 6.44772 21 7 21Z"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33333 7H9.34667"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33333 15.1666H9.34667"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33333 23.3333H9.34667"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
