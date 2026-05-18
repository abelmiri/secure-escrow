"use client"

import React from "react"
import { Box } from "@mui/material"
import styles from "./styles/Stepper.module.scss"

type Step = {
  id: number
  label: string
}

type Props = {
  currentStep: number
  steps?: Step[]
}

const defaultSteps: Step[] = [
  { id: 1, label: "جزئیات و مبلغ" },
  { id: 2, label: "اطلاعات طرفین و اسناد" },
  { id: 3, label: "بررسی و ارسال" },
]

export default function Stepper({ currentStep, steps = defaultSteps }: Props) {
  return (
    <Box className={styles.stepper}>
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isDone = step.id < currentStep

        return (
          <Box key={step.id} className={styles.item}>
            <Box
              className={`${styles.circle} ${
                isActive ? styles.active : ""
              } ${isDone ? styles.done : ""}`}
            >
              {step.id}
            </Box>

            <Box className={`${styles.label}`}>{step.label}</Box>

            {index === 0 && (
              <Box
                className={`${styles.line} ${
                  step.id < currentStep ? styles.done : ""
                }`}
              />
            )}
          </Box>
        )
      })}
    </Box>
  )
}
