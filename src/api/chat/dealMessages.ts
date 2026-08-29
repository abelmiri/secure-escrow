import type { RefObject } from "react"
import API_URLS from "@/constants/urls/API_URLS"
import request from "@/request/request"

export interface DealChatSender {
  display_name: string
  is_current_user: boolean
}

export interface DealChatMessage {
  id: string | number
  deal?: string | number
  content?: string
  text?: string
  message?: string
  sender?: DealChatSender | null
  is_system?: boolean
  created_at?: string
  updated_at?: string
  sent_at?: string
  date?: string
  [key: string]: unknown
}

export interface SendDealMessageBody {
  content: string
  actor_id: string | number
}

export interface PaginatedDealChatMessagesResponse {
  count: number
  next: string | null
  previous: string | null
  results: DealChatMessage[]
}

export function getDealMessages({
  dealId,
  actorId,
  limit,
  offset,
  cancelToken,
}: {
  dealId: number
  actorId: string | number
  limit?: number
  offset?: number
  cancelToken?: RefObject<AbortController | null>
}) {
  return request.get({
    url: API_URLS.dealMessages({ id: dealId }),
    params: {
      actor_id: actorId,
      ...(limit !== undefined ? { limit } : {}),
      ...(offset !== undefined ? { offset } : {}),
    },
    cancelToken,
    dontToast: true,
  })
}

export function pollDealMessages({
  dealId,
  actorId,
  afterId,
  cancelToken,
}: {
  dealId: number
  actorId: string | number
  afterId: string | number
  cancelToken?: RefObject<AbortController | null>
}) {
  return request.get({
    url: API_URLS.dealMessagesPoll({ id: dealId }),
    params: { after_id: afterId, actor_id: actorId },
    cancelToken,
    dontToast: true,
  })
}

export function sendDealMessage({
  dealId,
  actorId,
  content,
}: {
  dealId: number
  actorId: string | number
  content: string
}) {
  return request.post({
    url: API_URLS.dealMessageSend({ id: dealId }),
    data: { content, actor_id: actorId } satisfies SendDealMessageBody,
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
