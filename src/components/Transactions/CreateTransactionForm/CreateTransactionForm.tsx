"use client"

import React, { Suspense, useState } from "react"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import Link from "next/link"
import Stepper from "@/components/Stepper/Stepper"
import styles from "./styles/CreateTransactionForm.module.scss"
import TransactionFormDetails from "@/components/Transactions/CreateTransactionForm/TransactionFormDetails"
import { Box, CircularProgress } from "@mui/material"

export default function CreateTransactionForm() {
  const [stage, setStage] = useState(1)
  const [createdDealId, setCreatedDealId] = useState<number | null>(null)
  const [createdItemId, setCreatedItemId] = useState<number | null>(null)

  const handleDealCreated = (dealId: number, itemId: number | null) => {
    setCreatedDealId(dealId)
    setCreatedItemId(itemId)
    setStage(2)
  }

  const handlePrevious = () => {
    setStage(1)
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
          itemId={createdItemId}
          onDealCreated={handleDealCreated}
          onPrevious={handlePrevious}
        />
      </Suspense>
    </Box>
  )
}
