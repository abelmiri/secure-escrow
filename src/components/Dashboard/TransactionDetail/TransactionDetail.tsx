"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  TextField,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material"
import Link from "next/link"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import PersonIcon from "@mui/icons-material/Person"
import DescriptionIcon from "@mui/icons-material/Description"
import DownloadIcon from "@mui/icons-material/Download"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import FolderZipIcon from "@mui/icons-material/FolderZip"
import { dealsData } from "@/constants/deals"
import styles from "./styles/TransactionDetail.module.scss"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export default function TransactionDetail({ id }: { id: string }) {
  const deal = dealsData.find((d) => d.id === id)
  const [tabValue, setTabValue] = useState(0)
  const [messageText, setMessageText] = useState("")

  if (!deal) {
    return (
      <Box className={styles.mainWrapper}>
        <Box className={styles.container}>
          <Typography>معامله‌ای با این شناسه یافت نشد.</Typography>
          <Link href="/dashboard" className={styles.backButton}>
            بازگشت به داشبورد
          </Link>
        </Box>
      </Box>
    )
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle message sending logic here
      setMessageText("")
    }
  }

  const getProgressIcon = (step: typeof deal.progress[0]) => {
    if (step.status === "completed" || step.icon === "check") {
      return <CheckCircleIcon className={styles.progressIconCompleted} />
    }
    if (step.status === "in_progress" || step.icon === "clock") {
      return <AccessTimeIcon className={styles.progressIconInProgress} />
    }
    return <RadioButtonUncheckedIcon className={styles.progressIconPending} />
  }

  return (
    <Box className={styles.mainWrapper}>
      <Box className={styles.container}>
        <Link href="/dashboard" className={styles.backButton}>
          <ArrowForwardIcon sx={{ fontSize: 18, transform: "rotate(0deg)" }} />
          بازگشت به داشبورد
        </Link>

        <Box className={styles.contentWrapper}>
          {/* Left Column */}
          <Box className={styles.leftColumn}>
            {/* Required Action Section */}
            {deal.requiredAction && (
              <Box className={styles.sectionCard}>
                <Typography variant="h3" className={styles.sectionTitle}>
                  اقدام مورد نیاز
                </Typography>
                <Box className={styles.actionContent}>
                  <Box className={styles.actionText}>
                    <AccessTimeIcon className={styles.actionIcon} />
                    <Typography className={styles.actionMessage}>
                      {deal.requiredAction.text}
                    </Typography>
                  </Box>
                  {deal.requiredAction.showAcceptButton && (
                    <Button
                      variant="contained"
                      className={styles.acceptButton}
                      fullWidth
                    >
                      پذیرش تحویل
                    </Button>
                  )}
                  {deal.requiredAction.showSupportButton && (
                    <Button
                      variant="outlined"
                      className={styles.supportButton}
                      startIcon={<ChatBubbleOutlineIcon />}
                      fullWidth
                    >
                      تماس با پشتیبانی
                    </Button>
                  )}
                </Box>
              </Box>
            )}

            {/* Transaction Parties Section */}
            {(deal.buyer || deal.seller) && (
              <Box className={styles.sectionCard}>
                <Typography variant="h3" className={styles.sectionTitle}>
                  طرفین معامله
                </Typography>
                <Box className={styles.partiesContent}>
                  {deal.buyer && (
                    <Box className={styles.partyItem}>
                      <Box className={styles.partyHeader}>
                        <Typography className={styles.partyLabel}>
                          خریدار
                        </Typography>
                        {deal.buyer.isVerified && (
                          <Box className={styles.verifiedBadge}>
                            <CheckCircleIcon className={styles.verifiedIcon} />
                            <Typography className={styles.verifiedText}>
                              تایید شده
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Typography className={styles.partyName}>
                        {deal.buyer.name}
                      </Typography>
                      <Typography className={styles.partyEmail}>
                        {deal.buyer.email}
                      </Typography>
                    </Box>
                  )}
                  {deal.seller && (
                    <Box className={styles.partyItem}>
                      <Box className={styles.partyHeader}>
                        <Typography className={styles.partyLabel}>
                          فروشنده
                        </Typography>
                        {deal.seller.isVerified && (
                          <Box className={styles.verifiedBadge}>
                            <CheckCircleIcon className={styles.verifiedIcon} />
                            <Typography className={styles.verifiedText}>
                              تایید شده
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Typography className={styles.partyName}>
                        {deal.seller.name}
                      </Typography>
                      <Typography className={styles.partyEmail}>
                        {deal.seller.email}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* Payment Summary Section */}
            <Box className={styles.sectionCard}>
              <Typography variant="h3" className={styles.sectionTitle}>
                خلاصه پرداخت
              </Typography>
              <Box className={styles.paymentContent}>
                <Box className={styles.paymentRow}>
                  <Typography className={styles.paymentLabel}>
                    مبلغ معامله
                  </Typography>
                  <Typography className={styles.paymentValue}>
                    {deal.amount} تومان
                  </Typography>
                </Box>
                {deal.serviceFee && (
                  <Box className={styles.paymentRow}>
                    <Typography className={styles.paymentLabel}>
                      کارمزد سرویس امانی (۲.۵٪)
                    </Typography>
                    <Typography className={styles.paymentValue}>
                      {deal.serviceFee} تومان
                    </Typography>
                  </Box>
                )}
                <Box className={`${styles.paymentRow} ${styles.paymentTotal}`}>
                  <Typography className={styles.paymentLabel}>مجموع</Typography>
                  <Typography className={styles.paymentValue}>
                    {deal.totalAmount || deal.amount} تومان
                  </Typography>
                </Box>
                {deal.paymentStatus && (
                  <Box className={styles.paymentStatusBox}>
                    <CheckCircleIcon className={styles.paymentStatusIcon} />
                    <Typography className={styles.paymentStatusText}>
                      {deal.paymentStatus}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Right Column */}
          <Box className={styles.rightColumn}>
            {/* Transaction Progress Section */}
            <Box className={styles.sectionCard}>
              <Typography variant="h3" className={styles.sectionTitle}>
                پیشرفت معامله
              </Typography>
              <Box className={styles.progressList}>
                {deal.progress.map((step, index) => (
                  <Box key={index} className={styles.progressItem}>
                    <Box className={styles.progressIconWrapper}>
                      {getProgressIcon(step)}
                    </Box>
                    <Box className={styles.progressContent}>
                      <Box className={styles.progressInfo}>
                        <Typography className={styles.progressTitle}>
                          {step.title}
                        </Typography>
                        <Typography className={styles.progressDescription}>
                          {step.description}
                        </Typography>
                      </Box>
                      {step.date && (
                        <Typography className={styles.progressDate}>
                          <div>{step.date}</div>
                          <div>{step.time}</div>
                        </Typography>
                      )}
                      {!step.date && step.status === "pending" && (
                        <Typography className={styles.progressStatus}>
                          در انتظار
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Tabs Section */}
            <Box className={styles.sectionCard}>
              <Box className={styles.tabsContainer}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  className={styles.tabs}
                >
                  <Tab label="پیام ها" className={styles.tab} />
                  <Tab label="اسناد" className={styles.tab} />
                  <Tab label="جزئیات" className={styles.tab} />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
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
                            <Typography className={styles.messageText}>
                              {message.text}
                            </Typography>
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
                          onChange={(e) => setMessageText(e.target.value)}
                          className={styles.messageInput}
                          variant="outlined"
                        />
                        <Button
                          variant="contained"
                          className={styles.sendButton}
                          onClick={handleSendMessage}
                        >
                          ارسال پیام
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Typography className={styles.noMessages}>
                      پیامی وجود ندارد
                    </Typography>
                  )}
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box className={styles.documentsContainer}>
                  {deal.documents && deal.documents.length > 0 ? (
                    <Box className={styles.documentsList}>
                      {deal.documents.map((doc) => {
                        const getDocumentIcon = () => {
                          if (doc.type === "PDF") {
                            return <PictureAsPdfIcon className={styles.documentIcon} />
                          }
                          if (doc.type === "ZIP") {
                            return <FolderZipIcon className={styles.documentIcon} />
                          }
                          return <InsertDriveFileIcon className={styles.documentIcon} />
                        }

                        return (
                          <Box key={doc.id} className={styles.documentItem}>
                            <Box className={styles.documentInfo}>
                              {getDocumentIcon()}
                              <Box className={styles.documentDetails}>
                                <Typography className={styles.documentName}>
                                  {doc.name}
                                </Typography>
                                <Box className={styles.documentMeta}>
                                  <Typography className={styles.documentType}>
                                    {doc.type}
                                  </Typography>
                                  <Typography className={styles.documentSize}>
                                    {doc.size}
                                  </Typography>
                                  <Typography className={styles.documentDate}>
                                    {doc.uploadDate}
                                  </Typography>
                                </Box>
                                <Typography className={styles.documentUploader}>
                                  آپلود شده توسط: {doc.uploadedBy}
                                </Typography>
                              </Box>
                            </Box>
                            <Button
                              variant="outlined"
                              className={styles.downloadButton}
                              startIcon={<DownloadIcon />}
                            >
                              دانلود
                            </Button>
                          </Box>
                        )
                      })}
                    </Box>
                  ) : (
                    <Typography className={styles.emptyState}>
                      اسنادی وجود ندارد
                    </Typography>
                  )}
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Box className={styles.detailsContainer}>
                  <Box className={styles.detailRow}>
                    <Typography className={styles.detailLabel}>
                      شناسه معامله
                    </Typography>
                    <Typography className={styles.detailValue}>
                      {deal.id}
                    </Typography>
                  </Box>
                  <Box className={styles.detailRow}>
                    <Typography className={styles.detailLabel}>عنوان</Typography>
                    <Typography className={styles.detailValue}>
                      {deal.title}
                    </Typography>
                  </Box>
                  <Box className={styles.detailRow}>
                    <Typography className={styles.detailLabel}>وضعیت</Typography>
                    <Typography className={styles.detailValue}>
                      {deal.status}
                    </Typography>
                  </Box>
                  <Box className={styles.detailRow}>
                    <Typography className={styles.detailLabel}>نقش شما</Typography>
                    <Typography className={styles.detailValue}>
                      {deal.role}
                    </Typography>
                  </Box>
                  <Box className={styles.detailRow}>
                    <Typography className={styles.detailLabel}>تاریخ ایجاد</Typography>
                    <Typography className={styles.detailValue}>
                      {deal.date}
                    </Typography>
                  </Box>
                  {deal.details && (
                    <>
                      {deal.details.category && (
                        <Box className={styles.detailRow}>
                          <Typography className={styles.detailLabel}>
                            دسته‌بندی
                          </Typography>
                          <Typography className={styles.detailValue}>
                            {deal.details.category}
                          </Typography>
                        </Box>
                      )}
                      {deal.details.description && (
                        <Box className={styles.detailRow}>
                          <Typography className={styles.detailLabel}>
                            توضیحات
                          </Typography>
                          <Typography className={styles.detailValue}>
                            {deal.details.description}
                          </Typography>
                        </Box>
                      )}
                      {deal.details.location && (
                        <Box className={styles.detailRow}>
                          <Typography className={styles.detailLabel}>
                            مکان
                          </Typography>
                          <Typography className={styles.detailValue}>
                            {deal.details.location}
                          </Typography>
                        </Box>
                      )}
                      {deal.details.deliveryMethod && (
                        <Box className={styles.detailRow}>
                          <Typography className={styles.detailLabel}>
                            روش تحویل
                          </Typography>
                          <Typography className={styles.detailValue}>
                            {deal.details.deliveryMethod}
                          </Typography>
                        </Box>
                      )}
                      {deal.details.inspectionPeriod && (
                        <Box className={styles.detailRow}>
                          <Typography className={styles.detailLabel}>
                            دوره بازرسی
                          </Typography>
                          <Typography className={styles.detailValue}>
                            {deal.details.inspectionPeriod}
                          </Typography>
                        </Box>
                      )}
                      {deal.details.terms && (
                        <Box className={`${styles.detailRow} ${styles.detailRowFull}`}>
                          <Typography className={styles.detailLabel}>
                            شرایط و ضوابط
                          </Typography>
                          <Typography className={styles.detailValue}>
                            {deal.details.terms}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </TabPanel>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
