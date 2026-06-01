import React from "react"
import StartTransactionForm from "@/components/Transactions/StartTransactionForm/StartTransactionForm"
import AuthGuard from "@/components/Auth/AuthGuard"

export default function StartTransactionPage() {
  return (
    <AuthGuard>
      <main>
        <StartTransactionForm />
      </main>
    </AuthGuard>
  )
}
