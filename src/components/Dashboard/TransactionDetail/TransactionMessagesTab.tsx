import { Avatar, Box, Button, TextField, Typography } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import type { Deal } from "@/constants/deals"
import styles from "./styles/TransactionDetail.module.scss"

interface TransactionMessagesTabProps {
  deal: Deal
  messageText: string
  onMessageTextChange: (value: string) => void
  onSendMessage: () => void
}

export default function TransactionMessagesTab({
  deal,
  messageText,
  onMessageTextChange,
  onSendMessage,
}: TransactionMessagesTabProps) {
  return (
    <Box className={styles.messagesContainer}>
      {deal.messages && deal.messages.length > 0 ? (
        <>
          <Box className={styles.messagesList}>
            {deal.messages.map((message) => (
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
              className={styles.messageInput}
              variant="outlined"
            />
            <Button
              variant="contained"
              className={styles.sendButton}
              onClick={onSendMessage}
            >
              ارسال پیام
            </Button>
          </Box>
        </>
      ) : (
        <Typography className={styles.noMessages}>پیامی وجود ندارد</Typography>
      )}
    </Box>
  )
}
