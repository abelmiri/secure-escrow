import { SVGProps } from "react"

export interface ShieldProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function Shield({
  strokeColor = "#9810FA",
  width = 28,
  height = 28,
  ...props
}: ShieldProps) {
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
        d="M23.3333 15.1666C23.3333 21 19.25 23.9166 14.3967 25.6083C14.1425 25.6944 13.8665 25.6903 13.615 25.5966C8.75 23.9166 4.66667 21 4.66667 15.1666V6.99995C4.66667 6.69054 4.78958 6.39379 5.00838 6.175C5.22717 5.9562 5.52392 5.83329 5.83333 5.83329C8.16667 5.83329 11.0833 4.43329 13.1133 2.65995C13.3605 2.44879 13.6749 2.33276 14 2.33276C14.3251 2.33276 14.6395 2.44879 14.8867 2.65995C16.9283 4.44495 19.8333 5.83329 22.1667 5.83329C22.4761 5.83329 22.7728 5.9562 22.9916 6.175C23.2104 6.39379 23.3333 6.69054 23.3333 6.99995V15.1666Z"
        stroke={strokeColor}
        strokeWidth="2.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
