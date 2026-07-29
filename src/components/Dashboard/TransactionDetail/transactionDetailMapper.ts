import type { Deal } from "@/constants/deals"
import { getPartyMobileNumber } from "@/hooks/deals/useDeal"
import type {
  DealDetail,
  DealDocument,
  DealHistoryItem,
  DealItem,
  DealParty,
  DealWorkflow,
} from "@/hooks/deals/useDeal"
import type { UploadedDealDocument } from "@/hooks/documents/useDealDocuments"

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

const imageFileTypes = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/svg+xml",
])

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

const getDocumentFileName = (document: DealDocument | UploadedDealDocument) =>
  "file_name" in document
    ? document.file_name
    : document.name || document.title || document.file || document.url || ""

const getDocumentFileType = (
  document: DealDocument | UploadedDealDocument,
) => {
  const directType = "file_type" in document ? document.file_type : undefined
  if (directType) return directType.trim().toLowerCase().replace(/^\./, "")

  const fileName = getDocumentFileName(document)
  return fileName.split(".").pop()?.trim().toLowerCase() || ""
}

const resolveImageDocumentsCount = (
  documents?: Array<DealDocument | UploadedDealDocument>,
) =>
  documents?.filter((document) =>
    imageFileTypes.has(getDocumentFileType(document)),
  ).length

const resolveAdditionalDetails = (
  apiDeal: DealDetail,
  item?: DealItem,
  documents?: Array<DealDocument | UploadedDealDocument>,
) => {
  const details: Array<{ label: string; value: string }> = []
  const addDetail = (label: string, value: unknown) => {
    const formattedValue = formatDetailValue(value)
    if (formattedValue) details.push({ label, value: formattedValue })
  }

  addDetail("کد پیگیری", apiDeal.trace_number)
  addDetail("تعداد تصاویر", resolveImageDocumentsCount(documents))
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

const resolveEscrowAmount = (apiDeal: DealDetail) => {
  const escrowAmount = Number(apiDeal.items?.[0]?.escrow_price)
  if (Number.isFinite(escrowAmount)) return escrowAmount

  return resolveAmount(apiDeal)
}

const mapParty = (party?: DealParty) => {
  if (!party) return undefined

  const identifier = getPartyMobileNumber(party)
  const user = typeof party.user === "object" ? party.user : undefined
  const firstName = user?.first_name || party.first_name || ""
  const lastName = user?.last_name || party.last_name || ""
  const fullName =
    user?.full_name || party.full_name || `${firstName} ${lastName}`.trim()

  return {
    name: fullName || identifier || "نامشخص",
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

const mapHistoryStateToProgressStatus = (
  state?: string,
  isCurrentWorkflowItem = false,
): Deal["progress"][number]["status"] => {
  const normalizedState = state?.toLowerCase()

  if (
    normalizedState === "completed" ||
    normalizedState === "complete" ||
    normalizedState === "done"
  ) {
    return "completed"
  }

  if (
    normalizedState === "not_started" ||
    normalizedState === "not-started" ||
    normalizedState === "not started"
  ) {
    return "pending"
  }

  if (normalizedState === "in_progress" || normalizedState === "current") {
    return "in_progress"
  }

  if (normalizedState === "pending") {
    return isCurrentWorkflowItem ? "in_progress" : "pending"
  }

  return "pending"
}

const getProgressIconName = (
  status: Deal["progress"][number]["status"],
): Deal["progress"][number]["icon"] =>
  status === "completed"
    ? "check"
    : status === "in_progress"
      ? "clock"
      : "circle"

const mapHistoryItemToProgress = (
  item: DealHistoryItem,
  currentStep?: string,
  currentWorkflow?: DealWorkflow | null,
): Deal["progress"][number] => {
  const isCurrentWorkflowItem =
    Boolean(currentWorkflow?.group) && item.group_name === currentWorkflow?.group
  const status = item.state
    ? mapHistoryStateToProgressStatus(item.state, isCurrentWorkflowItem)
    : currentStep && item.to_step_name === currentStep
      ? "in_progress"
      : item.timestamp
        ? "completed"
        : "pending"
  const { date, time } = formatHistoryTimestamp(item.timestamp)

  return {
    title:
      item.group_name ||
      item.to_step_name ||
      item.from_step_name ||
      "مرحله قرارداد",
    description: item.description || item.step_group_name || "روند قرارداد",
    date,
    time,
    status,
    icon: getProgressIconName(status),
  }
}

const resolveProgress = (
  apiDeal: DealDetail,
  fallbackProgress: Deal["progress"],
) => {
  if (!apiDeal.history?.length) return fallbackProgress
  const usesCurrentHistoryShape = apiDeal.history.some(
    (item) => item.group_name || item.state || item.description,
  )

  if (usesCurrentHistoryShape) {
    return apiDeal.history.map((item) =>
      mapHistoryItemToProgress(item, undefined, apiDeal.current_workflow),
    )
  }

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

export const mapApiDealToUi = (
  apiDeal: DealDetail,
  staticTemplate: Deal,
  currentUserMobile?: string,
  documents?: UploadedDealDocument[],
): Deal => {
  const firstItem = apiDeal.items?.[0]
  const status = resolveStatus(apiDeal.state)
  const currentParty = currentUserMobile
    ? apiDeal.parties?.find(
        (party) =>
          getPartyMobileNumber(party) === currentUserMobile ||
          party.mobile_number === currentUserMobile,
      )
    : undefined
  const buyer = apiDeal.parties?.find((party) => party.role === "customer")
  const seller = apiDeal.parties?.find((party) => party.role === "beneficiary")
  const counterparty = currentUserMobile
    ? apiDeal.parties?.find(
        (party) =>
          getPartyMobileNumber(party) !== currentUserMobile &&
          party.mobile_number !== currentUserMobile,
      )
    : apiDeal.parties?.[0]
  const escrowAmount = resolveEscrowAmount(apiDeal).toLocaleString("fa-IR")
  const totalAmount = resolveAmount(apiDeal).toLocaleString("fa-IR")
  const acceptAction = apiDeal.next_available_actions?.find(
    (action) => action.action.toLowerCase() === "accept",
  )

  return {
    ...staticTemplate,
    id: apiDeal.label || apiDeal.id.toString(),
    title: firstItem?.name || firstItem?.description || "معامله بدون عنوان",
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
    amount: escrowAmount,
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
    totalAmount,
    paymentStatus: undefined,
    buyer: apiDeal.parties ? mapParty(buyer) : staticTemplate.buyer,
    seller: apiDeal.parties ? mapParty(seller) : staticTemplate.seller,
    details: {
      category: resolveSubcategory(firstItem),
      description: firstItem?.description || undefined,
      location: resolveLocation(firstItem),
      additionalDetails: resolveAdditionalDetails(
        apiDeal,
        firstItem,
        documents?.length ? documents : apiDeal.documents,
      ),
    },
  }
}
