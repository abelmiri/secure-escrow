import React from "react"
import CreateTransactionForm from "@/components/Transactions/CreateTransactionForm/CreateTransactionForm"
import AuthGuard from "@/components/Auth/AuthGuard"

type SearchParams = Record<string, string | string[] | undefined>

function getSearchParam(searchParams: SearchParams, key: string) {
  const value = searchParams[key]
  return Array.isArray(value) ? value[0] : value
}

function getInitialTransactionState(searchParams: SearchParams) {
  const dealIdParam =
    getSearchParam(searchParams, "dealId") || getSearchParam(searchParams, "id")
  const stageParam = Number(
    getSearchParam(searchParams, "stage") ||
      getSearchParam(searchParams, "step"),
  )
  const parsedDealId = dealIdParam ? Number(dealIdParam) : null

  if (parsedDealId && Number.isFinite(parsedDealId)) {
    return {
      initialDealId: parsedDealId,
      initialStage: stageParam === 1 || stageParam === 2 ? stageParam : 3,
    }
  }

  return { initialDealId: null, initialStage: 1 }
}

export default async function CreateTransactionPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>
}) {
  const initialState = getInitialTransactionState((await searchParams) || {})

  return (
    <AuthGuard>
      <main style={{ backgroundColor: "#f9fafb" }}>
        <CreateTransactionForm {...initialState} />
      </main>
    </AuthGuard>
  )
}
