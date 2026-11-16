import { SVGProps } from "react"

export default function AgreementIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m7 12 4-3h4l4 3 6 7-5 5a2 2 0 0 1-2.8 0L7 16" fill="#B7C6FF" />
      <path
        d="m25 12-4-3h-4l-5.2 4.2a1.8 1.8 0 0 0 2.3 2.8l2.9-2 7 6 2-4"
        fill="#E3EAFF"
      />
      <path d="m17 19 4 4m-7-1 3 3" />
      <path d="m3 10 4-1 4 10-4 2-4-9Z" fill="#E3EAFF" />
      <path d="m29 10-4-1-4 10 4 2 4-9Z" fill="#F2B13B" />
      <path d="m13.5 4 2 2 3-3" stroke="#F2B13B" />
    </svg>
  )
}
