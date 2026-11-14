import { SVGProps } from "react"

export default function ValuablesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path fill="none" d="M7 4h10l4 5-9 11L3 9z" />
      <path d="M3 9h18M9.5 4L8 9l4 11 4-11-1.5-5" />
    </svg>
  )
}
