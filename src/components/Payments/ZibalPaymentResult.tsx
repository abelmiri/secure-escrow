"use client"

import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import Link from "next/link"
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"
import {
  getPaymentDealId,
  getZibalPaymentUrl,
  type DealPayment,
} from "@/hooks/deals/zibalPayment"

export default function ZibalPaymentResult() {
  const params = useSearchParams()
  const orderId = params.get("order_id") || ""
  const validId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      orderId,
    )
  // URL success/status hints are never evidence of payment.
  const {
    data: payment,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<DealPayment>(
    validId ? API_URLS.zibalPaymentStatus({ orderId }) : null,
    (url: string) => request.get({ url, dontToast: true }),
    {
      refreshInterval: (data) => (data?.status === "pending" ? 5000 : 0),
      refreshWhenHidden: false,
    },
  )
  const dealId = getPaymentDealId(orderId)
  const paymentUrl = payment ? getZibalPaymentUrl(payment) : null

  return (
    <Box
      component="main"
      sx={{
        maxWidth: 640,
        mx: "auto",
        my: 8,
        px: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h5" component="h1">
        نتیجهٔ پرداخت
      </Typography>
      {!validId ? (
        <Alert severity="error">شناسهٔ پرداخت معتبر نیست.</Alert>
      ) : isLoading ? (
        <CircularProgress aria-label="بررسی نتیجهٔ پرداخت" />
      ) : error ? (
        <Alert severity="warning">
          دریافت وضعیت پرداخت ممکن نشد؛ این خطا به معنی ناموفق بودن پرداخت نیست.
          دوباره بررسی کنید.
        </Alert>
      ) : payment ? (
        <Alert
          severity={
            payment.status === "verified"
              ? "success"
              : payment.status === "failed" || payment.status === "needs_review"
                ? "warning"
                : "info"
          }
        >
          {payment.message}
        </Alert>
      ) : null}
      {validId && (
        <Button
          variant="outlined"
          disabled={isValidating}
          onClick={() => void mutate().catch(() => undefined)}
        >
          بررسی مجدد وضعیت
        </Button>
      )}
      {!error && paymentUrl && (
        <Button
          component="a"
          href={paymentUrl}
          referrerPolicy="strict-origin-when-cross-origin"
          variant="contained"
        >
          ادامهٔ پرداخت در زیبال
        </Button>
      )}
      {payment?.next_action === "contact_support" && (
        <Button component={Link} href="/contact">
          تماس با پشتیبانی
        </Button>
      )}
      <Button
        component={Link}
        href={dealId ? `/dashboard/${dealId}` : "/dashboard"}
      >
        {payment?.next_action === "retry_payment"
          ? "بازگشت به معامله برای تلاش مجدد"
          : "بازگشت به معاملات"}
      </Button>
    </Box>
  )
}
