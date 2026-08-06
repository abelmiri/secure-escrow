"use client"

import { useCallback, useState } from "react"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"

export interface PartnershipRequestPayload {
  name: string
  full_name: string
  phone_number: string
  email: string
  business_type: string
  description?: string | null
}

export type PartnershipRequestResponse = {
  id?: string | number
  tracking_id?: string | number
  tracking_code?: string | number
  reference_id?: string | number
  code?: string | number
  data?: {
    id?: string | number
    tracking_id?: string | number
    tracking_code?: string | number
    reference_id?: string | number
    code?: string | number
  }
}

export function usePartnershipRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const submitPartnershipRequest = useCallback(
    async (data: PartnershipRequestPayload) => {
      setIsSubmitting(true)
      setError(null)

      try {
        const response = await request.post({
          url: API_URLS.partnershipRequest,
          data,
          successMessage:
            "درخواست همکاری شما با موفقیت ثبت شد. تیم امان‌یار پس از بررسی اطلاعات برای هماهنگی جلسه با شما تماس خواهد گرفت.",
          failMessage: "ثبت درخواست همکاری با خطا مواجه شد",
        })
        return response as PartnershipRequestResponse
      } catch (submitError) {
        setError(submitError)
        throw submitError
      } finally {
        setIsSubmitting(false)
      }
    },
    [],
  )

  return {
    submitPartnershipRequest,
    isSubmitting,
    error,
  }
}
