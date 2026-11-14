import { SVGProps } from "react"

export default function SupportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      stroke="#16288F"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 16v-2a10 10 0 0 1 20 0v2" />
      <rect x="4" y="13" width="6" height="10" rx="3" fill="#E3EAFF" />
      <rect x="22" y="13" width="6" height="10" rx="3" fill="#E3EAFF" />
      <path d="M25 23v1a3 3 0 0 1-3 3h-4" />
      <rect x="13" y="25" width="6" height="4" rx="2" fill="#16288F" />
    </svg>
  )
}
