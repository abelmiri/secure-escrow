import TransactionDetail from "@/components/Dashboard/TransactionDetail/TransactionDetail"
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
  return <TransactionDetail id={id} />
}
