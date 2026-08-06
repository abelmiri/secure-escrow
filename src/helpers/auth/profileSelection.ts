import LOCAL_STORAGE_VALUES from "@/constants/storage/LOCAL_STORAGE_VALUES"

export type SelectedRepresentedPartner =
  | {
      type: "personal"
      id: null
      name: string
    }
  | {
      type: "partner"
      id: string | number
      name: string
    }

export const profileSelectionChangedEvent = "profileSelectionChanged"

export function getSelectedRepresentedPartner() {
  if (typeof window === "undefined") return null

  const selected = localStorage.getItem(
    LOCAL_STORAGE_VALUES.ACCOUNT.selectedRepresentedPartners,
  )

  if (!selected) return null

  try {
    return JSON.parse(selected) as SelectedRepresentedPartner
  } catch {
    return null
  }
}

export function setSelectedRepresentedPartner(
  selected: SelectedRepresentedPartner,
) {
  localStorage.setItem(
    LOCAL_STORAGE_VALUES.ACCOUNT.selectedRepresentedPartners,
    JSON.stringify(selected),
  )
  window.dispatchEvent(new CustomEvent(profileSelectionChangedEvent))
}

export function clearSelectedRepresentedPartner() {
  localStorage.removeItem(
    LOCAL_STORAGE_VALUES.ACCOUNT.selectedRepresentedPartners,
  )
  window.dispatchEvent(new CustomEvent(profileSelectionChangedEvent))
}
