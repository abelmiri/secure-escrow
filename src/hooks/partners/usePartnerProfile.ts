import useSWR from "swr"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"

export interface PartnerProfileMember {
  first_name?: string
  last_name?: string
  national_code?: string
  mobile_number?: string
}

export interface PartnerProfileType {
  id: number
  name: string
  registered_name: string
  id_number: string
  economic_number: string
  registration_number: string
  image: string | null
  phone_number: string
  email: string
  shaba_number: string
  city: number
  province: number
  postal_code: string
  full_address: string | null
  members: PartnerProfileMember[]
  is_active: boolean
  is_profile_complete: boolean
  are_documents_sent: boolean
  is_allowed_as_broker: boolean
}

const normalizePartnerProfile = (data: unknown) => {
  if (!data || typeof data !== "object") return null

  const objectData = data as {
    profile?: unknown
    partner?: unknown
    data?: unknown
  }

  if (objectData.profile && typeof objectData.profile === "object") {
    return objectData.profile as PartnerProfileType
  }

  if (objectData.partner && typeof objectData.partner === "object") {
    return objectData.partner as PartnerProfileType
  }

  if (objectData.data && typeof objectData.data === "object") {
    return objectData.data as PartnerProfileType
  }

  return data as PartnerProfileType
}

export function usePartnerProfile(brokerId: string | number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    brokerId ? API_URLS.partnerProfile({ brokerId }) : null,
    (url: string) =>
      request.get({
        url,
        dontToast: true,
        failMessage: "دریافت اطلاعات پروفایل کارگزاری با خطا مواجه شد",
      }),
  )

  return {
    partnerProfile: normalizePartnerProfile(data),
    isLoading,
    error,
    mutate,
  }
}
