import type { PartnerProfileType } from "@/context/auth/AuthType"

export default function normalizePartnerProfile(
  data: unknown,
): PartnerProfileType | null {
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
