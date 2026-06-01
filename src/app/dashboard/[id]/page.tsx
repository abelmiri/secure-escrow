import TransactionDetail from "@/components/Dashboard/TransactionDetail/TransactionDetail"
import AuthGuard from "@/components/Auth/AuthGuard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "جزئیات معامله | امان یار",
  description: "مشاهده جزئیات و وضعیت معامله در امان یار",
}

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  return (
    <AuthGuard>
      <TransactionDetail id={id} />
    </AuthGuard>
  )
}
