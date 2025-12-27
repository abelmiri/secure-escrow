import { SVGProps } from "react"

export interface UserAvatarProps extends SVGProps<SVGSVGElement> {
  fillColor?: string
}

export default function UserAvatar({
  fillColor = "#d4e2ff",
  width = 48,
  height = 48,
  ...props
}: UserAvatarProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="24" cy="24" r="24" fill={fillColor} />
      <path
        d="M24 24C27.3137 24 30 21.3137 30 18C30 14.6863 27.3137 12 24 12C20.6863 12 18 14.6863 18 18C18 21.3137 20.6863 24 24 24Z"
        fill="var(--color-secondary)"
      />
      <path
        d="M24 28C17.3726 28 12 33.3726 12 40H36C36 33.3726 30.6274 28 24 28Z"
        fill="var(--color-secondary)"
      />
    </svg>
  )
}
