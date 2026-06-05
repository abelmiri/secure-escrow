"use client"

import React, { Suspense } from "react"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import Link from "next/link"
import Stepper from "@/components/Stepper/Stepper"
import styles from "./styles/CreateTransactionForm.module.scss"
import TransactionFormDetails from "@/components/Transactions/CreateTransactionForm/TransactionFormDetails"
import { Box, CircularProgress } from "@mui/material"

export default function CreateTransactionForm() {
  return (
    <Box className={styles.container}>
      <Link href="/dashboard" className={styles.backButton}>
        <ArrowForwardIcon sx={{ fontSize: 18, transform: "rotate(0deg)" }} />
        بازگشت به داشبورد
      </Link>
      <Stepper currentStep={1} />
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={28} />
          </Box>
        }
      >
        <TransactionFormDetails />
      </Suspense>
    </Box>
  )
}
