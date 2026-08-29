import useSWR from "swr"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"
import useUser from "@/context/auth/hooks/useUser"
import normalizePartnerProfile from "@/helpers/partners/normalizePartnerProfile"

export type {
  PartnerProfileMemberType,
  PartnerProfileType,
} from "@/context/auth/AuthType"

export function usePartnerProfile(brokerId: string | number | null) {
  const { partnerProfiles } = useUser()
  const storedPartnerProfile = partnerProfiles.find(
    (profile) => String(profile.id) === String(brokerId),
  )
  const { data, error, isLoading, mutate } = useSWR(
    brokerId ? API_URLS.partnerProfile({ brokerId }) : null,
    (url: string) =>
      request.get({
        url,
        dontToast: true,
        failMessage: "دریافت اطلاعات پروفایل کارگزاری با خطا مواجه شد",
      }),
    {
      fallbackData: storedPartnerProfile,
      revalidateOnMount: !storedPartnerProfile,
    },
  )

  return {
    partnerProfile: normalizePartnerProfile(data),
    isLoading,
    error,
    mutate,
  }
}
