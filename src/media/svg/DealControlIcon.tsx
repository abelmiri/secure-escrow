import { SVGProps } from "react"

export default function DealControlIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        d="M5 9h22M5 16h22M5 23h22"
        fill="none"
        stroke="#16288F"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="11"
        cy="9"
        r="3.3"
        fill="#E3EAFF"
        stroke="#16288F"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="21.5"
        cy="16"
        r="3.3"
        fill="#F2B13B"
        stroke="#16288F"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="13"
        cy="23"
        r="3.3"
        fill="#E3EAFF"
        stroke="#16288F"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
