import { SVGProps } from "react"

export interface SecureEscrowProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export default function SecureEscrow({
  strokeColor = "white",
  width = 15,
  height = 19,
  ...props
}: SecureEscrowProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 15 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.1667 10.0004C14.1667 14.167 11.25 16.2504 7.78333 17.4587C7.6018 17.5202 7.40461 17.5173 7.225 17.4504C3.75 16.2504 0.833332 14.167 0.833332 10.0004V4.16704C0.833332 3.94603 0.92113 3.73407 1.07741 3.57779C1.23369 3.42151 1.44565 3.33371 1.66667 3.33371C3.33333 3.33371 5.41667 2.33371 6.86667 1.06704C7.04321 0.916208 7.26779 0.833334 7.5 0.833334C7.7322 0.833334 7.95679 0.916208 8.13333 1.06704C9.59167 2.34204 11.6667 3.33371 13.3333 3.33371C13.5543 3.33371 13.7663 3.42151 13.9226 3.57779C14.0789 3.73407 14.1667 3.94603 14.1667 4.16704V10.0004Z"
        stroke={strokeColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

