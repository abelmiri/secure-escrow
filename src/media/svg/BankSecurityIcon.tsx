import { SVGProps } from "react"

export default function BankSecurityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        d="M16 3.5l10 3.9v8c0 5.8-4.2 10.2-10 12.6C10.2 25.600 6 21.200 6 15.400v-8z"
        fill="#E3EAFF"
        stroke="#16288F"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 14.500v-1.500a3 3 0 0 1 6 0v1.500"
        fill="none"
        stroke="#16288F"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="11.5"
        y="14.5"
        width="9"
        height="7"
        rx="2"
        fill="#16288F"
        stroke="#16288F"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="18" r="1" fill="#FFFFFF" />
    </svg>
  )
}
