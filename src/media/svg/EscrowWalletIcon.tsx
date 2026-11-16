import { SVGProps } from "react"

export default function EscrowWalletIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        d="M7 9.500L20.500 5.200A2 2 0 0 1 23 7.100V9.500"
        fill="#B7C6FF"
        stroke="#FFFFFF"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="4"
        y="9"
        width="24"
        height="17"
        rx="4"
        fill="#E3EAFF"
        stroke="#FFFFFF"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="18.5"
        y="14.5"
        width="9.5"
        height="7"
        rx="3.5"
        fill="#F2B13B"
        stroke="#FFFFFF"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="18" r="1" fill="#16288F" />
    </svg>
  )
}
