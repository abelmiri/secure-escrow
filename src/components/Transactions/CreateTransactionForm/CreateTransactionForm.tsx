"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { Box, CircularProgress } from "@mui/material"
import Stepper from "@/components/Stepper/Stepper"
import TransactionFormDetails from "./TransactionFormDetails"
import styles from "./styles/CreateTransactionForm.module.scss"

interface CreateTransactionFormProps {
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
        <ArrowForwardIcon className={styles.backIcon} />
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
