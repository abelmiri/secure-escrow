import { useCallback, useState } from "react"
import { mutate } from "swr"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"

export interface WorkflowActionSubmission {
  transition_id: number
  deal?: Record<string, unknown>
  form?: Record<string, unknown>
  files?: Record<string, File[]>
}

export function useDealWorkflowAction() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitWorkflowAction = useCallback(
    async (
      dealId: number,
      submission: WorkflowActionSubmission,
      brokerId: string | number | null = null,
    ) => {
      setIsSubmitting(true)
      const dealUrl = brokerId
        ? API_URLS.brokerDeal({ brokerId, id: dealId })
        : API_URLS.deal({ id: dealId })

      try {
        if (!submission.files || Object.keys(submission.files).length === 0) {
          const response = await request.post({
            url: API_URLS.dealWorkflowActions({ id: dealId }),
            data: {
              transition_id: submission.transition_id,
              ...(submission.form ? { form: submission.form } : {}),
              ...(submission.deal ? { deal: submission.deal } : {}),
            },
            successMessage: "اقدام با موفقیت ثبت شد.",
            failMessage: "ثبت اقدام با خطا مواجه شد.",
          })

          await mutate(dealUrl)
          return response
        }

        const formData = new FormData()
        formData.append("transition_id", submission.transition_id.toString())

        // Add form fields
        if (submission.form) {
          formData.append("form", JSON.stringify(submission.form))
        }

        if (submission.deal) {
          formData.append("deal", JSON.stringify(submission.deal))
        }

        // Add files
        if (submission.files) {
          Object.entries(submission.files).forEach(
            ([documentTypeCode, files]) => {
              files.forEach((file) => {
                formData.append(documentTypeCode, file)
              })
            },
          )
        }

        const response = await request.post({
          url: API_URLS.dealWorkflowActions({ id: dealId }),
          data: formData,
          successMessage: "اقدام با موفقیت ثبت شد.",
          failMessage: "ثبت اقدام با خطا مواجه شد.",
        })

        await mutate(dealUrl)
        return response
      } finally {
        setIsSubmitting(false)
      }
    },
    [],
  )

  return { submitWorkflowAction, isSubmitting }
}
