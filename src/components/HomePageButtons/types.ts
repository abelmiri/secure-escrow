export interface ButtonConfig {
  label: string
  variant: "contained" | "outlined" | "text"
  colorType: "first" | "secondary" | "third"
  onClick?: () => void
}

export interface HomePageButtonsProps {
  buttons?: ButtonConfig[] | undefined
  className?: string
}
