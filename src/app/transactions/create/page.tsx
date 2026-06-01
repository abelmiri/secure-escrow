import React from "react"
import CreateTransactionForm from "@/components/Transactions/CreateTransactionForm/CreateTransactionForm"
import AuthGuard from "@/components/Auth/AuthGuard"

export default function CreateTransactionPage() {
  return (
    <AuthGuard>
      <main style={{ backgroundColor: "#f9fafb" }}>
        <CreateTransactionForm />
      </main>
    </AuthGuard>
  )
}
