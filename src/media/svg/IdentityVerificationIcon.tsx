import { SVGProps } from "react"

export default function IdentityVerificationIcon(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}
    >
      <rect
        x="3"
        y="7"
        width="26"
        height="18"
        rx="4"
        fill="#E3EAFF"
        stroke="#16288F"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="10.5"
        cy="14.5"
        r="2.8"
        fill="#B7C6FF"
        stroke="#16288F"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.500 21.500a4.200 4.200 0 0 1 8 0"
        fill="none"
        stroke="#16288F"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 13h6M19 17h3"
        fill="none"
        stroke="#16288F"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23.5" cy="21" r="2.7" fill="#0A8554" />
      <path
        d="M22.300 21l.9.900 1.700-1.800"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
