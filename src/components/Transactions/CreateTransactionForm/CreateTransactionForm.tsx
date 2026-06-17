"use client"

import React, { Suspense, useState } from "react"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import Link from "next/link"
import Stepper from "@/components/Stepper/Stepper"
import styles from "./styles/CreateTransactionForm.module.scss"
import TransactionFormDetails from "@/components/Transactions/CreateTransactionForm/TransactionFormDetails"
import { Box, CircularProgress } from "@mui/material"

type CreateTransactionFormProps = {
  initialDealId?: number | null
  initialStage?: number
}

export default function CreateTransactionForm({
  initialDealId = null,
  initialStage = 1,
}: CreateTransactionFormProps) {
  const [stage, setStage] = useState(initialStage)
  const [createdDealId, setCreatedDealId] = useState<number | null>(
    initialDealId,
  )

  const handleDealCreated = (dealId: number) => {
    setCreatedDealId(dealId)
    setStage(2)
  }

  const handleStageTwoCompleted = () => {
    setStage(3)
  }

  const handlePrevious = () => {
    setStage((prev) => Math.max(1, prev - 1))
  }

  return (
    <Box className={styles.container}>
      <Link href="/dashboard" className={styles.backButton}>
        <ArrowForwardIcon sx={{ fontSize: 18, transform: "rotate(0deg)" }} />
        بازگشت به داشبورد
      </Link>
      <Stepper currentStep={stage} />
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={28} />
          </Box>
        }
      >
        <TransactionFormDetails
          stageNumber={stage}
          dealId={createdDealId}
          onDealCreated={handleDealCreated}
          onStageTwoCompleted={handleStageTwoCompleted}
          onPrevious={handlePrevious}
        />
      </Suspense>
    </Box>
  )
}
