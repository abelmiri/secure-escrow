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
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import PersonIcon from "@mui/icons-material/Person"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined"
import DownloadIcon from "@mui/icons-material/Download"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import FolderZipIcon from "@mui/icons-material/FolderZip"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { dealsData } from "@/constants/deals"
import styles from "./styles/TransactionDetail.module.scss"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const CustomCheckIcon = ({ className }: { className?: string }) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
  >
    <path
      d="M18.1678 8.33332C18.5484 10.2011 18.2772 12.1428 17.3994 13.8348C16.5216 15.5268 15.0902 16.8667 13.3441 17.6311C11.5979 18.3955 9.64252 18.5381 7.80391 18.0353C5.9653 17.5325 4.35465 16.4145 3.24056 14.8678C2.12646 13.3212 1.57626 11.4394 1.68171 9.53615C1.78717 7.63294 2.54189 5.8234 3.82004 4.4093C5.09818 2.9952 6.82248 2.06202 8.70538 1.76537C10.5883 1.46872 12.516 1.82654 14.167 2.77916"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 9.16659L10 11.6666L18.3333 3.33325"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

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
  const [tabValue, setTabValue] = useState(2) // Default to Messages to match the image
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
      return <CustomCheckIcon className={styles.progressIconCompleted} />
    }
    if (step.status === "in_progress" || step.icon === "clock") {
      return <AccessTimeOutlinedIcon className={styles.progressIconInProgress} />
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

        {/* Header Section */}
        <Box className={styles.header}>
          <Box className={styles.headerRight}>
            <Typography variant="h1" className={styles.title}>
              {deal.title}
            </Typography>
            <Box className={styles.headerMeta}>
              <Typography className={styles.transactionId}>
                شناسه معامله: {deal.id}
              </Typography>
              <Box className={`${styles.statusBadge} ${styles.processing}`}>
                {deal.status}
              </Box>
              <Box className={styles.roleBadge}>شما {deal.role} هستید</Box>
            </Box>
          </Box>
          <Box className={styles.headerLeft}>
            <Typography className={styles.amount}>
              {deal.amount} تومان
            </Typography>
            <Typography className={styles.amountLabel}>مبلغ امانی</Typography>
          </Box>
        </Box>

        {/* Highlighted Alert Box */}
        <Box className={styles.infoAlert}>
          <Box className={styles.alertContent}>
            <InfoOutlinedIcon className={styles.alertIcon} />
            <Typography className={styles.alertText}>
              فروشنده در حال انتقال دامنه است. زمانی که برای بازرسی شما آماده شد
              به شما اطلاع داده می‌شود.
            </Typography>
          </Box>
        </Box>

        <Box className={styles.contentWrapper}>
          {/* Left Column */}
          <Box className={styles.leftColumn}>
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
                TabIndicatorProps={{ style: { display: "none" } }}
                sx={{
                  minHeight: "28px",
                  height: "28px",
                  "& .MuiTabs-flexContainer": {
                    gap: "4px",
                  },
                }}
              >
                {[
                  {
                    label: "جزئیات",
                    icon: <SecurityOutlinedIcon />,
                    index: 0,
                  },
                  {
                    label: "اسناد",
                    icon: <DescriptionOutlinedIcon />,
                    index: 1,
                  },
                  {
                    label: "پیام‌ها",
                    icon: <ChatBubbleOutlineIcon />,
                    index: 2,
                  },
                ].map((item) => (
                  <Tab
                    key={item.index}
                    label={item.label}
                    icon={item.icon}
                    iconPosition="start"
                    sx={{
                      minHeight: "28px",
                      height: "28px",
                      padding: "0 16px",
                      borderRadius: "14px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#667085",
                      textTransform: "none",
                      display: "flex",
                      flexDirection: "row-reverse",
                      gap: "8px",
                      "&.Mui-selected": {
                        backgroundColor: "#ffffff",
                        color: "#101828",
                        boxShadow: "0px 1px 3px rgba(16, 24, 40, 0.1)",
                      },
                      "& .MuiTab-iconWrapper": {
                        margin: 0,
                        fontSize: "20px",
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Box>

              <TabPanel value={tabValue} index={0}>
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
                    <Typography className={styles.detailLabel}>
                      نقش شما
                    </Typography>
                    <Typography className={styles.detailValue}>
                      {deal.role}
                    </Typography>
                  </Box>
                  <Box className={styles.detailRow}>
                    <Typography className={styles.detailLabel}>
                      تاریخ ایجاد
                    </Typography>
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
                        <Box
                          className={`${styles.detailRow} ${styles.detailRowFull}`}
                        >
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

              <TabPanel value={tabValue} index={1}>
                <Box className={styles.documentsContainer}>
                  {deal.documents && deal.documents.length > 0 ? (
                    <Box className={styles.documentsList}>
                      {deal.documents.map((doc) => {
                        const getDocumentIcon = () => {
                          if (doc.type === "PDF") {
                            return (
                              <PictureAsPdfIcon className={styles.documentIcon} />
                            )
                          }
                          if (doc.type === "ZIP") {
                            return <FolderZipIcon className={styles.documentIcon} />
                          }
                          return (
                            <InsertDriveFileIcon
                              className={styles.documentIcon}
                            />
                          )
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
                <Box className={styles.messagesContainer}>
                  {deal.messages && deal.messages.length > 0 ? (
                    <>
                      <Box className={styles.messagesList}>
                        {deal.messages.map((message) => (
                          <Box
                            key={message.id}
                            className={`${styles.messageItem} ${
                              message.isCurrentUser
                                ? styles.messageCurrentUser
                                : ""
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
            </Box>
          </Box>

          {/* Right Column */}
          <Box className={styles.rightColumn}>
            {/* Required Action Section */}
            {deal.requiredAction && (
              <Box className={styles.sectionCard}>
                <Typography variant="h3" className={styles.sectionTitle}>
                  اقدام مورد نیاز
                </Typography>
                <Box className={styles.actionContent}>
                  <Box className={styles.actionText}>
                    <AccessTimeOutlinedIcon className={styles.actionIcon} />
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
                            <Typography className={styles.verifiedText}>
                              تایید شده
                            </Typography>
                            <CustomCheckIcon className={styles.verifiedIcon} />
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
                            <Typography className={styles.verifiedText}>
                              تایید شده
                            </Typography>
                            <CustomCheckIcon className={styles.verifiedIcon} />
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
                    <CustomCheckIcon className={styles.paymentStatusIcon} />
                    <Typography className={styles.paymentStatusText}>
                      {deal.paymentStatus}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
