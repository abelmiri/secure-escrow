import type { RefObject } from "react"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"

export interface DealChatUser {
  id?: string | number
  first_name?: string
  last_name?: string
  full_name?: string
  name?: string
  username?: string
  mobile_number?: string
  is_current_user?: boolean
  isCurrentUser?: boolean
  is_mine?: boolean
}

export interface DealChatMessage {
  id: string | number
  deal?: string | number
  content?: string
  text?: string
  message?: string
  sender?: DealChatUser | string | number | null
  sender_name?: string
  senderName?: string
  user?: DealChatUser | string | number | null
  is_system?: boolean
  created_at?: string
  updated_at?: string
  sent_at?: string
  date?: string
  is_current_user?: boolean
  isCurrentUser?: boolean
  is_mine?: boolean
  [key: string]: unknown
}

export interface SendDealMessageBody {
  content: string
}

export interface PaginatedDealChatMessagesResponse {
  count: number
  next: string | null
  previous: string | null
  results: DealChatMessage[]
}

export function getDealMessages({
  dealId,
  limit,
  offset,
  cancelToken,
}: {
  dealId: number
  limit?: number
  offset?: number
  cancelToken?: RefObject<AbortController | null>
}) {
  return request.get({
    url: API_URLS.dealMessages({ id: dealId }),
    params: {
      ...(limit !== undefined ? { limit } : {}),
      ...(offset !== undefined ? { offset } : {}),
    },
    cancelToken,
    dontToast: true,
  })
}

export function pollDealMessages({
  dealId,
  afterId,
  cancelToken,
}: {
  dealId: number
  afterId: string | number
  cancelToken?: RefObject<AbortController | null>
}) {
  return request.get({
    url: API_URLS.dealMessagesPoll({ id: dealId, afterId }),
    cancelToken,
    dontToast: true,
  })
}

export function sendDealMessage({
  dealId,
  content,
}: {
  dealId: number
  content: string
}) {
  return request.post({
    url: API_URLS.dealMessageSend({ id: dealId }),
    data: { content } satisfies SendDealMessageBody,
    dontToast: true,
  })
}

export function normalizeDealChatMessage(
  data: unknown,
): DealChatMessage | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null

  const message = data as Partial<DealChatMessage>
  if (typeof message.id !== "string" && typeof message.id !== "number") {
    return null
  }

  return message as DealChatMessage
}

export function normalizeDealChatMessages(data: unknown): DealChatMessage[] {
  if (Array.isArray(data)) {
    return data
      .map(normalizeDealChatMessage)
      .filter((message): message is DealChatMessage => !!message)
  }
  if (!data || typeof data !== "object") return []

  const response = data as Record<string, unknown>
  const possibleCollections = [
    response.collection,
    response.results,
    response.messages,
    response.data,
  ]
  const collection = possibleCollections.find(Array.isArray)

  if (Array.isArray(collection)) {
    return collection
      .map(normalizeDealChatMessage)
      .filter((message): message is DealChatMessage => !!message)
  }

  if (response.data && typeof response.data === "object") {
    const dataMessage = normalizeDealChatMessage(response.data)
    if (dataMessage) return [dataMessage]
  }

  const singleMessage = normalizeDealChatMessage(data)
  return singleMessage ? [singleMessage] : []
}
