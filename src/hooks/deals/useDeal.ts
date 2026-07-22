import useSWR from "swr"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

export interface DealPartyUser {
  mobile_number?: string
  email?: string
  full_name?: string
}

export interface DealParty {
  role?: string
  user?: string | DealPartyUser
  mobile_number?: string
  email?: string
  full_name?: string
}

export const getPartyMobileNumber = (party?: DealParty) => {
  if (!party) return ""
  if (typeof party.user === "string") return party.user
  return party.user?.mobile_number || party.mobile_number || ""
}

export interface DealItem {
  id?: number
  deal?: number
  name?: string
  description?: string
  escrow_price?: number | string | null
  images_count?: number
  price?: number | string
  total_price?: number | string
  quantity?: number | string
  slug?: string
  subcategory?: string | { id?: number; name?: string; slug?: string }
  properties?: Record<string, unknown>
  remaining_price_payment_description?: string | null
  remaining_price_payment_method?: string
}

export interface DealDocument {
  id?: number | string
  name?: string
  title?: string
  file?: string
  url?: string
  size?: string | number
  file_size?: string | number
  created_at?: string
  uploaded_at?: string
}

export interface DealWorkflow {
  group?: string
  step?: string
}

export interface DealHistoryItem {
  timestamp?: string | null
  action_label?: string
  from_step_name?: string
  to_step_name?: string
  step_group_name?: string
  performed_party?: string
}

export interface DealNextAction {
  transition_id: number
  action: string
  action_label: string
  destination_step: number
  destination_step_name: string
}

export interface DealDetail {
  id: number
  label?: string
  items?: DealItem[]
  parties?: DealParty[]
  documents?: DealDocument[]
  state?: number | string
  sub_state?: number | string
  total_amount?: number | string | null
  trace_number?: string
  created_at?: string
  updated_at?: string
  current_workflow?: DealWorkflow | null
  history?: DealHistoryItem[]
  next_available_actions?: DealNextAction[]
}

function normalizeDeal(data: unknown): DealDetail | null {
  if (!data || typeof data !== "object") return null

  if ("deal" in data) {
    const { deal } = data as { deal?: unknown }
    if (deal && typeof deal === "object") return deal as DealDetail
  }

  return data as DealDetail
}

export function useDeal(dealId: number | null) {
  const { data, error, isLoading, mutate } = useSWR(
    dealId ? API_URLS.deal({ id: dealId }) : null,
    (url: string) => request.get({ url }),
  )

  return {
    deal: normalizeDeal(data),
    isLoading,
    error,
    mutate,
  }
}
