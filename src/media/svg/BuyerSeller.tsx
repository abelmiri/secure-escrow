import { SVGProps } from "react"

export interface BuyerSellerProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function BuyerSeller({
  strokeColor = "white",
  width = 32,
  height = 32,
  ...props
}: BuyerSellerProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21.3333 28V25.3333C21.3333 23.9188 20.7714 22.5623 19.7712 21.5621C18.771 20.5619 17.4145 20 16 20H8C6.58552 20 5.22896 20.5619 4.22877 21.5621C3.22857 22.5623 2.66667 23.9188 2.66667 25.3333V28"
        stroke={strokeColor}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.3333 4.17078C22.477 4.46727 23.4899 5.13513 24.2129 6.06953C24.9359 7.00392 25.3283 8.15196 25.3283 9.33344C25.3283 10.5149 24.9359 11.663 24.2129 12.5974C23.4899 13.5318 22.477 14.1996 21.3333 14.4961"
        stroke={strokeColor}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.3333 28V25.3333C29.3324 24.1516 28.9391 23.0037 28.2151 22.0698C27.4912 21.1358 26.4775 20.4688 25.3333 20.1733"
        stroke={strokeColor}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.6667C14.9455 14.6667 17.3333 12.2789 17.3333 9.33333C17.3333 6.38781 14.9455 4 12 4C9.05449 4 6.66667 6.38781 6.66667 9.33333C6.66667 12.2789 9.05449 14.6667 12 14.6667Z"
        stroke={strokeColor}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

