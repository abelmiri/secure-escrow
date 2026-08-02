import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useRef } from "react"
import PersonIcon from "@mui/icons-material/Person"
import type { Deal, Message } from "@/constants/deals"
import type { DealChatMessage } from "@/api/chat/dealMessages"
import styles from "./styles/TransactionDetail.module.scss"

interface TransactionMessagesTabProps {
  deal: Deal
  apiMessages?: DealChatMessage[]
  currentUserId?: string | number
  isLoadingMessages?: boolean
  isSendingMessage?: boolean
  messageText: string
  onMessageTextChange: (value: string) => void
  onSendMessage: () => void
}

function resolveSenderName(message: DealChatMessage) {
  if (message.senderName) return message.senderName
  if (message.sender_name) return message.sender_name

  const sender = message.sender || message.user
  if (typeof sender === "string") return sender
  if (typeof sender === "number") return "شما"
  if (sender && typeof sender === "object") {
    const fullName =
      sender.full_name ||
      sender.name ||
      [sender.first_name, sender.last_name].filter(Boolean).join(" ")
    return fullName || sender.username || sender.mobile_number || "کاربر"
  }

  return "کاربر"
}

function resolveDate(message: DealChatMessage) {
  const date =
    message.sent_at || message.created_at || message.updated_at || message.date
  if (!date) return ""

  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return date

  return parsedDate.toLocaleString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

function resolveIsCurrentUser(
  message: DealChatMessage,
  currentUserId?: string | number,
) {
  if (message.is_current_user || message.is_mine || message.isCurrentUser) {
    return true
  }

  const sender = message.sender || message.user
  if (
    sender &&
    typeof sender === "object" &&
    (sender.is_current_user || sender.is_mine || sender.isCurrentUser)
  ) {
    return true
  }

  if (currentUserId === undefined) return false

  const senderId =
    typeof sender === "object" && sender !== null ? sender.id : sender

  return senderId !== undefined && String(senderId) === String(currentUserId)
}

function mapApiMessageToUi(
  message: DealChatMessage,
  currentUserId?: string | number,
): Message {
  return {
    id: String(message.id),
    senderName: resolveSenderName(message),
    date: resolveDate(message),
    text: message.content || message.text || message.message || "",
    isCurrentUser: resolveIsCurrentUser(message, currentUserId),
  }
}

export default function TransactionMessagesTab({
  deal,
  apiMessages,
  currentUserId,
  isLoadingMessages,
  isSendingMessage,
  messageText,
  onMessageTextChange,
  onSendMessage,
}: TransactionMessagesTabProps) {
  const messagesListRef = useRef<HTMLDivElement | null>(null)
  const messages = apiMessages
    ? apiMessages.map((message) => mapApiMessageToUi(message, currentUserId))
    : deal.messages
  const lastMessageId = messages?.[messages.length - 1]?.id

  useEffect(() => {
    const messagesList = messagesListRef.current
    if (!messagesList) return

    messagesList.scrollTop = messagesList.scrollHeight
  }, [lastMessageId, messages?.length])

  return (
    <Box className={styles.messagesContainer}>
      {isLoadingMessages ? (
        <Box className={styles.messagesLoading}>
          <CircularProgress size={28} />
        </Box>
      ) : messages && messages.length > 0 ? (
        <>
          <Box className={styles.messagesList} ref={messagesListRef}>
            {messages.map((message) => (
              <Box
                key={message.id}
                className={`${styles.messageItem} ${
                  message.isCurrentUser ? styles.messageCurrentUser : ""
                }`}
              >
                <Box className={styles.messageWrapper}>
                  <Box className={styles.messageHeader}>
                    <Avatar className={styles.messageAvatar}>
                      <PersonIcon />
                    </Avatar>
                    <Box className={styles.messageInfo}>
                      <Typography className={styles.messageSender}>
                        {message.senderName}
                      </Typography>
                      <Typography className={styles.messageDate}>
                        {message.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className={styles.messageBubble}>
                    <Typography className={styles.messageText}>
                      {message.text}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
          <Box className={styles.messageInputContainer}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="پیام خود را تایپ کنید..."
              value={messageText}
              onChange={(event) => onMessageTextChange(event.target.value)}
              disabled={isSendingMessage}
              className={styles.messageInput}
              variant="outlined"
            />
            <Button
              variant="contained"
              className={styles.sendButton}
              onClick={onSendMessage}
              disabled={isSendingMessage || !messageText.trim()}
            >
              {isSendingMessage ? "در حال ارسال..." : "ارسال پیام"}
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography className={styles.noMessages}>
            پیامی وجود ندارد
          </Typography>
          <Box className={styles.messageInputContainer}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="پیام خود را تایپ کنید..."
              value={messageText}
              onChange={(event) => onMessageTextChange(event.target.value)}
              disabled={isSendingMessage}
              className={styles.messageInput}
              variant="outlined"
            />
            <Button
              variant="contained"
              className={styles.sendButton}
              onClick={onSendMessage}
              disabled={isSendingMessage || !messageText.trim()}
            >
              {isSendingMessage ? "در حال ارسال..." : "ارسال پیام"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
