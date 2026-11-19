import { useCallback, useEffect, useRef, useState } from "react"
import { mutate } from "swr"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"
import { toastManager } from "@/lib/toastManager"
import { getRequestErrorMessage } from "@/lib/errorHelpers"
import {
  getZibalPaymentUrl,
  rememberPayment,
  type DealPayment,
} from "./zibalPayment"

export interface WorkflowActionSubmission {
  transition_id: number
  action?: string
  deal?: Record<string, unknown>
  form?: Record<string, unknown>
  files?: Record<string, File[]>
}

export function useDealWorkflowAction() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [payment, setPayment] = useState<DealPayment | null>(null)
  const submitting = useRef(false)

  useEffect(() => {
    const resetAfterReturn = () => {
      submitting.current = false
      setIsSubmitting(false)
    }
    window.addEventListener("pageshow", resetAfterReturn)
    return () => window.removeEventListener("pageshow", resetAfterReturn)
  }, [])

  const submitWorkflowAction = useCallback(
    async (
      dealId: number,
      submission: WorkflowActionSubmission,
      brokerId: string | number | null = null,
    ) => {
      if (submitting.current) return
      submitting.current = true
      setIsSubmitting(true)
      setPayment(null)
      let navigating = false
      const dealUrl = brokerId
        ? API_URLS.brokerDeal({ brokerId, id: dealId })
        : API_URLS.deal({ id: dealId })
      const workflowActionUrl = brokerId
        ? API_URLS.brokerDealWorkflowAction({ brokerId, id: dealId })
        : API_URLS.dealWorkflowActions({ id: dealId })

      try {
        let data: FormData | Record<string, unknown>
        if (submission.files && Object.keys(submission.files).length > 0) {
          data = new FormData()
          data.append("transition_id", String(submission.transition_id))
          if (submission.form)
            data.append("form", JSON.stringify(submission.form))
          if (submission.deal)
            data.append("deal", JSON.stringify(submission.deal))
          for (const [key, files] of Object.entries(submission.files)) {
            for (const file of files) data.append(key, file)
          }
        } else {
          data = {
            transition_id: submission.transition_id,
            ...(submission.form ? { form: submission.form } : {}),
            ...(submission.deal ? { deal: submission.deal } : {}),
          }
        }
        const response = await request.post({
          url: workflowActionUrl,
          data,
          dontToast: true,
        })
        const result: DealPayment | undefined = response?.payment
        if (submission.action?.toLowerCase() === "payment" && !result) {
          throw new Error("پاسخ پرداخت معتبر نیست؛ وضعیت معامله را بررسی کنید.")
        }
        if (result) {
          setPayment(result)
          rememberPayment(result.order_id, dealId)
          if (result.next_action === "redirect") {
            const url = getZibalPaymentUrl(result)
            if (!url)
              throw new Error(
                "آدرس درگاه پرداخت معتبر نیست؛ با پشتیبانی تماس بگیرید.",
              )
            window.location.assign(url)
            navigating = true
            return response
          }
          toastManager.addToast({
            message: result.message,
            type: result.status === "verified" ? "SUCCESS" : "WARNING",
          })
        } else {
          toastManager.addToast({
            message: "اقدام با موفقیت ثبت شد.",
            type: "SUCCESS",
          })
        }
        // A refresh failure must not turn an accepted action into a failed submission.
        await mutate(dealUrl).catch(() => undefined)
        return response
      } catch (error) {
        const err = error as { status?: number; data?: unknown }
        toastManager.addToast({
          message:
            error instanceof Error
              ? error.message
              : getRequestErrorMessage({
                  status: err?.status,
                  data: err?.data,
                  fallbackMessage: "ثبت اقدام با خطا مواجه شد.",
                }),
          type: "FAIL",
        })
        throw error
      } finally {
        if (!navigating) {
          submitting.current = false
          setIsSubmitting(false)
        }
      }
    },
    [],
  )

  return { submitWorkflowAction, isSubmitting, payment }
}
