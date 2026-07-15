import { useCallback, useState } from "react"
import { mutate } from "swr"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"

export function useDealWorkflowAction() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitWorkflowAction = useCallback(
    async (dealId: number, transitionId: number) => {
      setIsSubmitting(true)

      try {
        const response = await request.post({
          url: API_URLS.dealWorkflowActions({ id: dealId }),
          data: { transition_id: transitionId },
          successMessage: "اقدام با موفقیت ثبت شد.",
          failMessage: "ثبت اقدام با خطا مواجه شد.",
        })

        await mutate(API_URLS.deal({ id: dealId }))
        return response
      } finally {
        setIsSubmitting(false)
      }
    },
    [],
  )

  return { submitWorkflowAction, isSubmitting }
}
