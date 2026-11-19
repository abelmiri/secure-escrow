import { Suspense } from "react"
import type { Metadata } from "next"
import AuthGuard from "@/components/Auth/AuthGuard"
import ZibalPaymentResult from "@/components/Payments/ZibalPaymentResult"

export const metadata: Metadata = { title: "نتیجهٔ پرداخت | امان یار" }

export default function ZibalPaymentPage() {
  return (
    <Suspense fallback={<p>در حال بررسی پرداخت…</p>}>
      <AuthGuard skipProfileSelection>
        <ZibalPaymentResult />
      </AuthGuard>
    </Suspense>
  )
}
