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

export function useDealMessages(dealId: number | null) {
  const [messages, setMessages] = useState<DealChatMessage[]>([])
  const [messageText, setMessageText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const requestCancelToken = useRef<AbortController | null>(null)
  const pollGeneration = useRef(0)
  const lastMessageId = useRef<string | number | null>(null)

  const stopCurrentRequest = useCallback(() => {
    requestCancelToken.current?.abort()
    requestCancelToken.current = null
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
      setError(null)
      lastMessageId.current = null
      return
    }

    const generation = pollGeneration.current + 1
    pollGeneration.current = generation
    setIsLoading(true)
    setError(null)
    stopCurrentRequest()

    getDealMessages({ dealId, cancelToken: requestCancelToken })
      .then((data) => {
        if (pollGeneration.current !== generation) return

        const initialMessages = sortMessages(normalizeDealChatMessages(data))
        const latestInitialMessageId = getLatestMessageId(initialMessages)
        setMessages(initialMessages)
        lastMessageId.current = latestInitialMessageId
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
    }
  }, [dealId, startPolling, stopCurrentRequest])

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

  return {
    messages,
    messageText,
    setMessageText: updateMessageText,
    submitMessage,
    isLoading,
    isSending,
    error,
  }
}
