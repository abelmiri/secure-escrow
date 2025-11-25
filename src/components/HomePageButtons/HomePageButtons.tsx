import { Button, Box } from "@mui/material"
import type { HomePageButtonsProps, ButtonConfig } from "./types"
import styles from "./styles/HomePageButtons.module.scss"

const defaultButtons: HomePageButtonsProps["buttons"] = [
  {
    label: "First Color",
    variant: "contained",
    colorType: "first",
  },
  {
    label: "Secondary Color",
    variant: "outlined",
    colorType: "secondary",
  },
  {
    label: "Third Color",
    variant: "contained",
    colorType: "third",
  },
]

export default function HomePageButtons({
  buttons = defaultButtons,
  className,
}: HomePageButtonsProps) {
  const getButtonClassName = (colorType: string): string => {
    switch (colorType) {
      case "first":
        return styles.primaryButton
      case "secondary":
        return styles.secondaryButton
      case "third":
        return styles.thirdButton
      default:
        return styles.primaryButton
    }
  }

  const buttonsToRender: ButtonConfig[] = (buttons ??
    defaultButtons) as ButtonConfig[]

  return (
    <Box className={`${styles.buttonContainer} ${className || ""}`}>
      {buttonsToRender.map((button, index) => (
        <Button
          key={`${button.label}-${index}`}
          variant={button.variant}
          className={getButtonClassName(button.colorType)}
          onClick={button.onClick}
        >
          {button.label}
        </Button>
      ))}
    </Box>
  )
}
