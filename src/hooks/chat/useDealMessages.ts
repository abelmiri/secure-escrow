"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  getDealMessages,
  normalizeDealChatMessages,
  pollDealMessages,
  sendDealMessage,
  type DealChatMessage,
} from "@/api/chat/dealMessages"

export const DEAL_MESSAGE_MAX_LENGTH = 250
const DEAL_MESSAGES_PAGE_LIMIT = 30

function getLatestMessageId(messages: DealChatMessage[]) {
  return messages.reduce<string | number | null>((latestId, message) => {
    if (latestId === null) return message.id

    const numericLatestId = Number(latestId)
    const numericMessageId = Number(message.id)
    if (Number.isFinite(numericLatestId) && Number.isFinite(numericMessageId)) {
      return numericMessageId > numericLatestId ? message.id : latestId
    }

    return message.id
  }, null)
}

function getMessageTime(message: DealChatMessage) {
  const date =
    message.sent_at || message.created_at || message.updated_at || message.date
  if (!date) return 0

  const timestamp = new Date(date).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function sortMessages(messages: DealChatMessage[]) {
  return [...messages].sort((firstMessage, secondMessage) => {
    const firstId = Number(firstMessage.id)
    const secondId = Number(secondMessage.id)
    if (Number.isFinite(firstId) && Number.isFinite(secondId)) {
      return firstId - secondId
    }

    return getMessageTime(firstMessage) - getMessageTime(secondMessage)
  })
}

function mergeMessages(
  currentMessages: DealChatMessage[],
  incomingMessages: DealChatMessage[],
) {
  if (!incomingMessages.length) return currentMessages

  const existingIds = new Set(
    currentMessages.map((message) => String(message.id)),
  )
  const uniqueIncomingMessages = incomingMessages.filter((message) => {
    const messageId = String(message.id)
    if (existingIds.has(messageId)) return false
    existingIds.add(messageId)
    return true
  })

  return uniqueIncomingMessages.length
    ? sortMessages([...currentMessages, ...uniqueIncomingMessages])
    : currentMessages
}

function isCanceledRequest(error: unknown) {
  return (
    error === "CANCEL" ||
    String(error).toLowerCase().includes("abort") ||
    (typeof error === "object" &&
      error !== null &&
      (error as Record<string, unknown>).code === "ERR_CANCELED")
  )
}

function getPaginatedNextUrl(data: unknown) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null

  const next = (data as Record<string, unknown>).next
  return typeof next === "string" ? next : null
}

function getOffsetFromUrl(url: string | null) {
  if (!url) return null

  try {
    return Number(new URL(url).searchParams.get("offset"))
  } catch {
    const query = url.split("?")[1]
    if (!query) return null
    return Number(new URLSearchParams(query).get("offset"))
  }
}

function resolveNextOffset(data: unknown) {
  const offset = getOffsetFromUrl(getPaginatedNextUrl(data))
  return offset !== null && Number.isFinite(offset) ? offset : null
}

export function useDealMessages(dealId: number | null) {
  const [messages, setMessages] = useState<DealChatMessage[]>([])
  const [messageText, setMessageText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const requestCancelToken = useRef<AbortController | null>(null)
  const pageRequestCancelToken = useRef<AbortController | null>(null)
  const pollGeneration = useRef(0)
  const lastMessageId = useRef<string | number | null>(null)
  const nextOffset = useRef<number | null>(null)

  const stopCurrentRequest = useCallback(() => {
    requestCancelToken.current?.abort()
    requestCancelToken.current = null
  }, [])

  const stopPageRequest = useCallback(() => {
    pageRequestCancelToken.current?.abort()
    pageRequestCancelToken.current = null
  }, [])

  const startPolling = useCallback(
    async (generation: number) => {
      if (!dealId || lastMessageId.current === null) return

      while (pollGeneration.current === generation) {
        try {
          const data = await pollDealMessages({
            dealId,
            afterId: lastMessageId.current,
            cancelToken: requestCancelToken,
          })
          if (pollGeneration.current !== generation) return

          const incomingMessages = sortMessages(normalizeDealChatMessages(data))
          if (incomingMessages.length) {
            lastMessageId.current =
              getLatestMessageId(incomingMessages) || lastMessageId.current
            setMessages((currentMessages) =>
              mergeMessages(currentMessages, incomingMessages),
            )
          }
        } catch (pollError) {
          if (isCanceledRequest(pollError)) return
          setError(pollError)
          await new Promise((resolve) => window.setTimeout(resolve, 2000))
        }
      }
    },
    [dealId],
  )

  const restartPolling = useCallback(() => {
    if (lastMessageId.current === null) return

    stopCurrentRequest()
    pollGeneration.current += 1
    void startPolling(pollGeneration.current)
  }, [startPolling, stopCurrentRequest])

  const updateMessageText = useCallback((value: string) => {
    setMessageText(value.slice(0, DEAL_MESSAGE_MAX_LENGTH))
  }, [])

  useEffect(() => {
    if (!dealId) {
      stopCurrentRequest()
      setMessages([])
      setMessageText("")
      setIsLoading(false)
      setIsLoadingPrevious(false)
      setError(null)
      lastMessageId.current = null
      nextOffset.current = null
      return
    }

    const generation = pollGeneration.current + 1
    pollGeneration.current = generation
    setIsLoading(true)
    setError(null)
    stopCurrentRequest()

    getDealMessages({
      dealId,
      limit: DEAL_MESSAGES_PAGE_LIMIT,
      offset: 0,
      cancelToken: requestCancelToken,
    })
      .then((data) => {
        if (pollGeneration.current !== generation) return

        const initialMessages = sortMessages(normalizeDealChatMessages(data))
        const latestInitialMessageId = getLatestMessageId(initialMessages)
        setMessages(initialMessages)
        lastMessageId.current = latestInitialMessageId
        nextOffset.current = resolveNextOffset(data)
        setIsLoading(false)

        if (latestInitialMessageId !== null) {
          void startPolling(generation)
        }
      })
      .catch((loadError) => {
        if (isCanceledRequest(loadError)) return
        setError(loadError)
        setIsLoading(false)
      })

    return () => {
      pollGeneration.current += 1
      stopCurrentRequest()
      stopPageRequest()
    }
  }, [dealId, startPolling, stopCurrentRequest, stopPageRequest])

  const submitMessage = useCallback(async () => {
    const content = messageText.trim().slice(0, DEAL_MESSAGE_MAX_LENGTH)
    if (!dealId || !content || isSending) return

    setIsSending(true)
    setError(null)

    try {
      const data = await sendDealMessage({ dealId, content })
      const sentMessage = normalizeDealChatMessages(data)[0]

      if (sentMessage) {
        const currentUserMessage = {
          ...sentMessage,
          is_current_user: true,
        }
        setMessages((currentMessages) =>
          mergeMessages(currentMessages, [currentUserMessage]),
        )
        lastMessageId.current = currentUserMessage.id
        restartPolling()
      }

      setMessageText("")
    } catch (sendError) {
      setError(sendError)
    } finally {
      setIsSending(false)
    }
  }, [dealId, isSending, messageText, restartPolling])

  const loadPreviousMessages = useCallback(async () => {
    if (!dealId || isLoadingPrevious || nextOffset.current === null) return

    setIsLoadingPrevious(true)
    setError(null)

    try {
      const data = await getDealMessages({
        dealId,
        limit: DEAL_MESSAGES_PAGE_LIMIT,
        offset: nextOffset.current,
        cancelToken: pageRequestCancelToken,
      })
      const previousMessages = sortMessages(normalizeDealChatMessages(data))

      setMessages((currentMessages) =>
        mergeMessages(currentMessages, previousMessages),
      )
      nextOffset.current = resolveNextOffset(data)
    } catch (loadError) {
      if (!isCanceledRequest(loadError)) {
        setError(loadError)
      }
    } finally {
      setIsLoadingPrevious(false)
    }
  }, [dealId, isLoadingPrevious])

  return {
    messages,
    messageText,
    setMessageText: updateMessageText,
    submitMessage,
    loadPreviousMessages,
    hasPreviousMessages: nextOffset.current !== null,
    isLoading,
    isLoadingPrevious,
    isSending,
    error,
  }
}
