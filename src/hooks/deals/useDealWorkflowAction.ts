import { useCallback, useState } from "react"
import { mutate } from "swr"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"

export interface WorkflowActionSubmission {
  transition_id: number
  form?: Record<string, unknown>
  files?: Record<string, File[]>
}

export function useDealWorkflowAction() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitWorkflowAction = useCallback(
    async (dealId: number, submission: WorkflowActionSubmission) => {
      setIsSubmitting(true)

      try {
        const formData = new FormData()
        formData.append("transition_id", submission.transition_id.toString())

        // Add form fields
        if (submission.form) {
          formData.append("form", JSON.stringify(submission.form))
        }

        // Add files
        if (submission.files) {
          Object.entries(submission.files).forEach(([documentTypeCode, files]) => {
            files.forEach((file) => {
              formData.append(documentTypeCode, file)
            })
          })
        }

        const response = await request.post({
          url: API_URLS.dealWorkflowActions({ id: dealId }),
          data: formData,
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
