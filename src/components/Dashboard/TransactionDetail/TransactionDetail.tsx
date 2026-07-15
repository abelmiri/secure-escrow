"use client"

import { useContext, useState } from "react"
import {
  Box,
  Typography,
  Button,
  TextField,
  Tabs,
  Tab,
  Avatar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import type { Deal } from "@/constants/deals"
import { authContext } from "@/context/auth/authProvider"
import { useDeal } from "@/hooks/deals/useDeal"
import { useDealWorkflowAction } from "@/hooks/deals/useDealWorkflowAction"
import type {
  DealDetail,
  DealHistoryItem,
  DealItem,
  DealParty,
} from "@/hooks/deals/useDeal"
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

const roleLabels: Record<string, Deal["role"]> = {
  customer: "خریدار",
  beneficiary: "فروشنده",
  broker: "کارگزار",
}

const statusLabels: Record<string, string> = {
  Created: "ایجاد شده",
  Pending: "در انتظار",
  WaitingForPayment: "در انتظار پرداخت",
  PaymentPending: "در انتظار پرداخت",
  InProgress: "در حال انجام",
  Processing: "در حال انجام",
  Inspection: "دوره بازرسی",
  Completed: "تکمیل شده",
  Done: "تکمیل شده",
  Cancelled: "لغو شده",
  Canceled: "لغو شده",
  Rejected: "رد شده",
}

const resolveStatus = (state?: number | string) => {
  const normalizedState = state?.toString() || ""
  return statusLabels[normalizedState] || normalizedState || "نامشخص"
}

const resolveStatusType = (status: string): Deal["statusType"] => {
  if (status === "تکمیل شده") return "completed"
  if (status === "در انتظار" || status === "در انتظار پرداخت") return "pending"
  if (status === "دوره بازرسی") return "inspection"
  return "processing"
}

const resolveSubcategory = (item?: DealItem) => {
  if (!item?.subcategory) return undefined
  if (typeof item.subcategory === "string") return item.subcategory
  return item.subcategory.name || item.subcategory.slug
}

const propertyLabels: Record<string, string> = {
  author_name: "نام نویسنده",
  book_condition: "وضعیت کتاب",
  book_title: "عنوان کتاب",
  publication_year: "سال انتشار",
}

const propertyValueLabels: Record<string, string> = {
  new: "نو",
  like_new: "در حد نو",
  used: "دست دوم",
}

const paymentMethodLabels: Record<string, string> = {
  Cash: "پرداخت نقدی/کارت‌به‌کارت",
  Escrow: "واریز به حساب امانی",
  Cheque: "چک صیادی",
  Change: "تهاتر یا معاوضه",
}

const formatDetailValue = (value: unknown): string | null => {
  if (value === null || value === undefined || value === "") return null
  if (typeof value === "number") return value.toLocaleString("fa-IR")
  if (typeof value === "boolean") return value ? "بله" : "خیر"
  if (typeof value === "string") return propertyValueLabels[value] || value
  if (Array.isArray(value)) {
    const values = value
      .map(formatDetailValue)
      .filter((item): item is string => Boolean(item))
    return values.length ? values.join("، ") : null
  }

  try {
    return JSON.stringify(value)
  } catch {
    return null
  }
}

const resolveLocation = (item?: DealItem) => {
  const location = item?.properties?.["sample-map-prop"]
  if (!location || typeof location !== "object" || Array.isArray(location)) {
    return undefined
  }

  const { lat, lng } = location as { lat?: unknown; lng?: unknown }
  if (typeof lat !== "number" || typeof lng !== "number") return undefined
  return `${lat.toLocaleString("fa-IR")}، ${lng.toLocaleString("fa-IR")}`
}

const resolveAdditionalDetails = (apiDeal: DealDetail, item?: DealItem) => {
  const details: Array<{ label: string; value: string }> = []
  const addDetail = (label: string, value: unknown) => {
    const formattedValue = formatDetailValue(value)
    if (formattedValue) details.push({ label, value: formattedValue })
  }

  addDetail("کد پیگیری", apiDeal.trace_number)
  addDetail("تعداد", item?.quantity)
  addDetail("تعداد تصاویر", item?.images_count)
  addDetail("مبلغ واحد (ریال)", item?.price)
  addDetail("مبلغ امانی (ریال)", item?.escrow_price)
  addDetail(
    "روش پرداخت مبلغ باقی‌مانده",
    item?.remaining_price_payment_method
      ? paymentMethodLabels[item.remaining_price_payment_method] ||
          item.remaining_price_payment_method
      : null,
  )
  addDetail(
    "توضیحات پرداخت مبلغ باقی‌مانده",
    item?.remaining_price_payment_description,
  )

  Object.entries(item?.properties || {}).forEach(([key, value]) => {
    if (key !== "sample-map-prop") {
      addDetail(propertyLabels[key] || key, value)
    }
  })

  return details
}

const resolveAmount = (apiDeal: DealDetail) => {
  const totalAmount = Number(apiDeal.total_amount)
  if (
    apiDeal.total_amount !== null &&
    apiDeal.total_amount !== undefined &&
    Number.isFinite(totalAmount)
  ) {
    return totalAmount
  }

  return (apiDeal.items || []).reduce(
    (sum, item) =>
      sum +
      Number(item.price || item.total_price || 0) * Number(item.quantity || 1),
    0,
  )
}

const mapParty = (party?: DealParty) => {
  if (!party) return undefined

  const identifier = party.mobile_number || party.user || ""
  return {
    name: party.full_name || identifier || "نامشخص",
    email: party.email || identifier,
    isVerified: false,
  }
}

const formatHistoryTimestamp = (timestamp?: string | null) => {
  if (!timestamp) return { date: "", time: "" }

  const parsedTimestamp = new Date(timestamp)
  if (Number.isNaN(parsedTimestamp.getTime())) return { date: "", time: "" }

  return {
    date: parsedTimestamp.toLocaleDateString("fa-IR"),
    time: parsedTimestamp.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

const mapHistoryItemToProgress = (
  item: DealHistoryItem,
  currentStep?: string,
): Deal["progress"][number] => {
  const isCurrentStep = Boolean(
    currentStep && item.to_step_name === currentStep,
  )
  const status = isCurrentStep
    ? "in_progress"
    : item.timestamp
      ? "completed"
      : "pending"
  const { date, time } = formatHistoryTimestamp(item.timestamp)

  return {
    title: item.to_step_name || item.from_step_name || "مرحله قرارداد",
    description: item.step_group_name || "روند قرارداد",
    date,
    time,
    status,
    icon:
      status === "completed"
        ? "check"
        : status === "in_progress"
          ? "clock"
          : "circle",
  }
}

const resolveProgress = (
  apiDeal: DealDetail,
  fallbackProgress: Deal["progress"],
) => {
  if (!apiDeal.history?.length) return fallbackProgress

  const completedTransitionKeys = new Set(
    apiDeal.history
      .filter((item) => Boolean(item.timestamp))
      .map(
        (item) =>
          `${item.action_label}|${item.from_step_name}|${item.to_step_name}`,
      ),
  )
  const normalizedHistory = apiDeal.history.filter((item) => {
    if (item.timestamp) return true

    const transitionKey = `${item.action_label}|${item.from_step_name}|${item.to_step_name}`
    return !completedTransitionKeys.has(transitionKey)
  })
  const latestCompletedStep = normalizedHistory.reduce<{
    step?: string
    timestamp: number
  } | null>((latest, item) => {
    if (!item.timestamp) return latest

    const timestamp = new Date(item.timestamp).getTime()
    if (Number.isNaN(timestamp)) return latest
    if (latest && latest.timestamp >= timestamp) return latest

    return { step: item.to_step_name, timestamp }
  }, null)
  const currentStep =
    latestCompletedStep?.step || apiDeal.current_workflow?.step

  return normalizedHistory.map((item) =>
    mapHistoryItemToProgress(item, currentStep),
  )
}

const mapApiDealToUi = (
  apiDeal: DealDetail,
  staticTemplate: Deal,
  currentUserMobile?: string,
): Deal => {
  const firstItem = apiDeal.items?.[0]
  const status = resolveStatus(apiDeal.state)
  const currentParty = currentUserMobile
    ? apiDeal.parties?.find(
        (party) =>
          party.user === currentUserMobile ||
          party.mobile_number === currentUserMobile,
      )
    : undefined
  const buyer = apiDeal.parties?.find((party) => party.role === "customer")
  const seller = apiDeal.parties?.find((party) => party.role === "beneficiary")
  const counterparty = currentUserMobile
    ? apiDeal.parties?.find(
        (party) =>
          party.user !== currentUserMobile &&
          party.mobile_number !== currentUserMobile,
      )
    : apiDeal.parties?.[0]
  const amount = resolveAmount(apiDeal).toLocaleString("fa-IR")
  const acceptAction = apiDeal.next_available_actions?.find(
    (action) => action.action.toLowerCase() === "accept",
  )

  return {
    ...staticTemplate,
    id: apiDeal.label || apiDeal.id.toString(),
    title:
      firstItem?.name ||
      firstItem?.description ||
      "معامله بدون عنوان",
    status,
    statusType: resolveStatusType(status),
    role: currentParty?.role
      ? roleLabels[currentParty.role] || staticTemplate.role
      : "نامشخص",
    participant: counterparty
      ? `طرف مقابل: ${mapParty(counterparty)?.name}`
      : "طرف مقابل ثبت نشده",
    date: apiDeal.created_at
      ? new Date(apiDeal.created_at).toLocaleDateString("fa-IR")
      : "",
    amount,
    currency: "ریال",
    progress: resolveProgress(apiDeal, staticTemplate.progress),
    requiredAction: acceptAction
      ? {
          text: `با پذیرش تحویل، قرارداد وارد مرحله «${acceptAction.destination_step_name}» می‌شود.`,
          showAcceptButton: true,
          showSupportButton: true,
        }
      : undefined,
    serviceFee: undefined,
    totalAmount: amount,
    paymentStatus: undefined,
    buyer: apiDeal.parties ? mapParty(buyer) : staticTemplate.buyer,
    seller: apiDeal.parties ? mapParty(seller) : staticTemplate.seller,
    details: {
      category: resolveSubcategory(firstItem),
      description: firstItem?.description || undefined,
      location: resolveLocation(firstItem),
      additionalDetails: resolveAdditionalDetails(apiDeal, firstItem),
    },
  }
}

export default function TransactionDetail({ id }: { id: string }) {
  const { authState } = useContext(authContext)
  const staticDeal = dealsData.find((deal) => deal.id === id)
  const numericId = Number(id)
  const apiDealId =
    !staticDeal && Number.isInteger(numericId) && numericId > 0
      ? numericId
      : null
  const { deal: apiDeal, isLoading, error } = useDeal(apiDealId)
  const { submitWorkflowAction, isSubmitting: isSubmittingWorkflowAction } =
    useDealWorkflowAction()
  const deal =
    staticDeal ||
    (apiDeal
      ? mapApiDealToUi(
          apiDeal,
          dealsData[0],
          authState.user?.mobile_number,
        )
      : undefined)
  const [tabValue, setTabValue] = useState(2) // Default to Messages to match the image
  const [messageText, setMessageText] = useState("")
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false)
  const acceptAction = apiDeal?.next_available_actions?.find(
    (action) => action.action.toLowerCase() === "accept",
  )

  if (isLoading) {
    return (
      <Box className={styles.mainWrapper}>
        <Box
          className={styles.container}
          sx={{ display: "flex", justifyContent: "center", padding: "80px" }}
        >
          <CircularProgress size={36} />
        </Box>
      </Box>
    )
  }

  if (!deal) {
    return (
      <Box className={styles.mainWrapper}>
        <Box className={styles.container}>
          <Typography>
            {error
              ? "دریافت اطلاعات معامله با خطا مواجه شد."
              : "معامله‌ای با این شناسه یافت نشد."}
          </Typography>
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

  const handleAcceptDelivery = async () => {
    if (!apiDealId || !acceptAction) return

    try {
      await submitWorkflowAction(apiDealId, acceptAction.transition_id)
      setIsAcceptDialogOpen(false)
    } catch {
      // The request layer displays the API error and keeps the dialog open for retry.
    }
  }

  const getProgressIcon = (step: (typeof deal.progress)[0]) => {
    if (step.status === "completed" || step.icon === "check") {
      return <CustomCheckIcon className={styles.progressIconCompleted} />
    }
    if (step.status === "in_progress" || step.icon === "clock") {
      return (
        <AccessTimeOutlinedIcon className={styles.progressIconInProgress} />
      )
    }
    return <RadioButtonUncheckedIcon className={styles.progressIconPending} />
  }

  return (
    <Box className={styles.mainWrapper}>
      <Box className={styles.container}>
        <Link href="/dashboard" className={styles.backButton}>
          <ArrowForwardIcon className={styles.backIcon} />
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
                <span className={styles.transactionIdLabel}>شناسه معامله:</span>
                <span className={styles.transactionIdValue}>{deal.id}</span>
              </Typography>
              <Box
                className={`${styles.statusBadge} ${styles[deal.statusType]}`}
              >
                {deal.status}
              </Box>
              <Box className={styles.roleBadge}>شما {deal.role} هستید</Box>
            </Box>
          </Box>
          <Box className={styles.headerLeft}>
            <Typography className={styles.amount}>
              {deal.amount} {deal.currency || "تومان"}
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
                پیشرفت قرارداد
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
                    <Typography className={styles.detailLabel}>
                      عنوان
                    </Typography>
                    <Typography className={styles.detailValue}>
                      {deal.title}
                    </Typography>
                  </Box>
                  <Box className={styles.detailRow}>
                    <Typography className={styles.detailLabel}>
                      وضعیت
                    </Typography>
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
                      {deal.details.additionalDetails?.map((detail) => (
                        <Box key={detail.label} className={styles.detailRow}>
                          <Typography className={styles.detailLabel}>
                            {detail.label}
                          </Typography>
                          <Typography className={styles.detailValue}>
                            {detail.value}
                          </Typography>
                        </Box>
                      ))}
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
                              <PictureAsPdfIcon
                                className={styles.documentIcon}
                              />
                            )
                          }
                          if (doc.type === "ZIP") {
                            return (
                              <FolderZipIcon className={styles.documentIcon} />
                            )
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
                      onClick={
                        acceptAction
                          ? () => setIsAcceptDialogOpen(true)
                          : undefined
                      }
                      disabled={isSubmittingWorkflowAction}
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
                    {deal.amount} {deal.currency || "تومان"}
                  </Typography>
                </Box>
                {deal.serviceFee && (
                  <Box className={styles.paymentRow}>
                    <Typography className={styles.paymentLabel}>
                      کارمزد سرویس امانی (۲.۵٪)
                    </Typography>
                    <Typography className={styles.paymentValue}>
                      {deal.serviceFee} {deal.currency || "تومان"}
                    </Typography>
                  </Box>
                )}
                <Box className={`${styles.paymentRow} ${styles.paymentTotal}`}>
                  <Typography className={styles.paymentLabel}>مجموع</Typography>
                  <Typography className={styles.paymentValue}>
                    {deal.totalAmount || deal.amount}{" "}
                    {deal.currency || "تومان"}
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

      <Dialog
        open={isAcceptDialogOpen}
        onClose={() => {
          if (!isSubmittingWorkflowAction) setIsAcceptDialogOpen(false)
        }}
        slotProps={{
          paper: {
            sx: { direction: "rtl", borderRadius: "16px", width: "100%" },
          },
        }}
      >
        <DialogTitle>تأیید پذیرش تحویل</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "right", lineHeight: 1.8 }}>
            آیا از پذیرش تحویل مطمئن هستید؟ پس از تأیید، قرارداد وارد مرحله
            «{acceptAction?.destination_step_name}» می‌شود.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "8px 24px 20px", gap: "8px" }}>
          <Button
            variant="outlined"
            onClick={() => setIsAcceptDialogOpen(false)}
            disabled={isSubmittingWorkflowAction}
          >
            انصراف
          </Button>
          <Button
            variant="contained"
            onClick={handleAcceptDelivery}
            disabled={isSubmittingWorkflowAction}
            startIcon={
              isSubmittingWorkflowAction ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            تأیید و ادامه
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
