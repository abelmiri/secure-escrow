"use client"

import { useContext, useState } from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { dealsData } from "@/constants/deals"
import { authContext } from "@/context/auth/authProvider"
import { useDeal } from "@/hooks/deals/useDeal"
import type { DealNextAction } from "@/hooks/deals/useDeal"
import { useDealWorkflowAction } from "@/hooks/deals/useDealWorkflowAction"
import { useDealDocuments } from "@/hooks/documents/useDealDocuments"
import { useDealMessages } from "@/hooks/chat/useDealMessages"
import RequiredAction from "./RequiredAction"
import PaymentSummary from "./PaymentSummary"
import TransactionParties from "./TransactionParties"
import TransactionHeader from "./TransactionHeader"
import TransactionProgress from "./TransactionProgress"
import TransactionTabs from "./TransactionTabs"
import WorkflowInfoAlert from "./WorkflowInfoAlert"
import { mapApiDealToUi } from "./transactionDetailMapper"
import styles from "./styles/TransactionDetail.module.scss"

export default function TransactionDetail({ id }: { id: string }) {
  const router = useRouter()
  const { authState } = useContext(authContext)
  const staticDeal = dealsData.find((deal) => deal.id === id)
  const numericId = Number(id)
  const apiDealId =
    !staticDeal && Number.isInteger(numericId) && numericId > 0
      ? numericId
      : null
  const { deal: apiDeal, isLoading, error } = useDeal(apiDealId)
  const { documents: apiDocuments, isLoading: isDocumentsLoading } =
    useDealDocuments(apiDealId)
  const {
    messages: apiMessages,
    messageText,
    setMessageText,
    submitMessage,
    loadPreviousMessages,
    hasPreviousMessages,
    isLoading: isMessagesLoading,
    isLoadingPrevious: isLoadingPreviousMessages,
    isSending: isSendingMessage,
  } = useDealMessages(apiDealId)
  const { submitWorkflowAction, isSubmitting: isSubmittingWorkflowAction } =
    useDealWorkflowAction()
  const deal =
    staticDeal ||
    (apiDeal
      ? mapApiDealToUi(
          apiDeal,
          dealsData[0],
          authState.user?.mobile_number,
          apiDocuments,
        )
      : undefined)
  const hasOnlyOneParty = apiDeal?.parties?.length === 1
  const requiredActions =
    hasOnlyOneParty && apiDeal?.next_available_actions
      ? apiDeal.next_available_actions.map((action) =>
          action.action.toLowerCase() === "accept"
            ? {
                ...action,
                action: "complete_contract",
                action_text: "تکمیل قرارداد",
              }
            : action,
        )
      : apiDeal?.next_available_actions
  const [tabValue, setTabValue] = useState(2) // Default to Messages to match the image

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

  const handleActionClick = async (
    action: DealNextAction,
    formData?: Record<string, unknown>,
    files?: Record<string, File[]>,
  ) => {
    if (!apiDealId) return

    if (action.action.toLowerCase() === "complete_contract") {
      router.push(
        `/contracts/create?dealId=${apiDealId}&stage=1&returnToDeal=true`,
      )
      return
    }

    if (action.action.toLowerCase() === "edit") {
      router.push(
        `/contracts/create?dealId=${apiDealId}&stage=1&workflowAction=edit`,
      )
      return
    }

    try {
      await submitWorkflowAction(apiDealId, {
        transition_id: action.transition_id,
        form: formData,
        files,
      })
    } catch {
      // The request layer displays the API error
    }
  }

  return (
    <Box className={styles.mainWrapper}>
      <Box className={styles.container}>
        <Link href="/dashboard" className={styles.backButton}>
          <ArrowForwardIcon className={styles.backIcon} />
          بازگشت به داشبورد
        </Link>

        <TransactionHeader deal={deal} />
        <WorkflowInfoAlert
          description={apiDeal?.current_workflow?.header_description}
        />

        <Box className={styles.contentWrapper}>
          <Box className={styles.leftColumn}>
            <TransactionProgress progress={deal.progress} />
            <TransactionTabs
              deal={deal}
              tabValue={tabValue}
              apiDealId={apiDealId}
              apiDocuments={apiDocuments}
              apiMessages={apiMessages}
              currentUserId={authState.user?.id}
              isDocumentsLoading={isDocumentsLoading}
              isMessagesLoading={isMessagesLoading}
              isLoadingPreviousMessages={isLoadingPreviousMessages}
              isSendingMessage={isSendingMessage}
              hasPreviousMessages={hasPreviousMessages}
              messageText={messageText}
              onTabChange={handleTabChange}
              onMessageTextChange={setMessageText}
              onSendMessage={submitMessage}
              onLoadPreviousMessages={loadPreviousMessages}
            />
          </Box>

          <Box className={styles.rightColumn}>
            {requiredActions && requiredActions.length >= 0 && (
              <RequiredAction
                dealId={apiDealId || undefined}
                actions={requiredActions}
                isSubmitting={isSubmittingWorkflowAction}
                creatorRole={apiDeal?.parties?.[0]?.role}
                actorDescription={apiDeal?.current_workflow?.actor_description}
                onActionClick={handleActionClick}
              />
            )}

            <TransactionParties parties={apiDeal?.parties} />
            <PaymentSummary deal={deal} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
