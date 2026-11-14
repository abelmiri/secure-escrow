import { SVGProps } from "react"

export default function VehiclesIcon(props: SVGProps<SVGSVGElement>) {
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
      <path
        fill="none"
        d="M4 17v-5l1.9-4.3A2 2 0 0 1 7.7 6.5h8.6a2 2 0 0 1 1.8 1.2L20 12v5z"
      />
      <path d="M4 12h16M6 17v2M18 17v2" />
      <circle cx="8" cy="14.6" r=".9" fill="white" stroke="none" />
      <circle cx="16" cy="14.6" r=".9" fill="white" stroke="none" />
    </svg>
  )
}
