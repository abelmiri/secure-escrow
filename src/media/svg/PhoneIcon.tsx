import { SVGProps } from "react"

export default function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        d="M9 4h4l2 6-2.800 1.800a14 14 0 0 0 6 6L20 15l6 2v4a3 3 0 0 1-3 3A19 19 0 0 1 6 7a3 3 0 0 1 3-3z"
        fill="#E3EAFF"
        stroke="#16288F"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.500 6.500a5.500 5.500 0 0 1 5 5M20.500 10.500a1.800 1.800 0 0 1 1 1"
        stroke="#F2B13B"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
