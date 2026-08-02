import { Box, Tab, Tabs } from "@mui/material"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined"
import type { Deal } from "@/constants/deals"
import type { DealChatMessage } from "@/api/chat/dealMessages"
import type { UploadedDealDocument } from "@/hooks/documents/useDealDocuments"
import TabPanel from "./TabPanel"
import TransactionDetailsTab from "./TransactionDetailsTab"
import TransactionDocumentsTab from "./TransactionDocumentsTab"
import TransactionMessagesTab from "./TransactionMessagesTab"
import styles from "./styles/TransactionDetail.module.scss"

interface TransactionTabsProps {
  deal: Deal
  tabValue: number
  apiDealId: number | null
  apiDocuments: UploadedDealDocument[]
  apiMessages: DealChatMessage[]
  currentUserId?: string | number
  isDocumentsLoading: boolean
  isMessagesLoading: boolean
  isSendingMessage: boolean
  messageText: string
  onTabChange: (_event: React.SyntheticEvent, newValue: number) => void
  onMessageTextChange: (value: string) => void
  onSendMessage: () => void
}

const tabItems = [
  { label: "جزئیات", icon: <SecurityOutlinedIcon />, index: 0 },
  { label: "اسناد", icon: <DescriptionOutlinedIcon />, index: 1 },
  { label: "پیام‌ها", icon: <ChatBubbleOutlineIcon />, index: 2 },
]

export default function TransactionTabs({
  deal,
  tabValue,
  apiDealId,
  apiDocuments,
  apiMessages,
  currentUserId,
  isDocumentsLoading,
  isMessagesLoading,
  isSendingMessage,
  messageText,
  onTabChange,
  onMessageTextChange,
  onSendMessage,
}: TransactionTabsProps) {
  return (
    <Box className={`${styles.sectionCard} ${styles.tabsCard}`}>
      <Box className={styles.tabsContainer}>
        <Tabs
          value={tabValue}
          onChange={onTabChange}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            minHeight: "28px",
            height: "28px",
            "& .MuiTabs-flexContainer": {
              gap: "4px",
            },
          }}
        >
          {tabItems.map((item) => (
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
        <TransactionDetailsTab deal={deal} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TransactionDocumentsTab
          deal={deal}
          apiDealId={apiDealId}
          apiDocuments={apiDocuments}
          isDocumentsLoading={isDocumentsLoading}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <TransactionMessagesTab
          deal={deal}
          apiMessages={apiDealId ? apiMessages : undefined}
          currentUserId={currentUserId}
          isLoadingMessages={apiDealId ? isMessagesLoading : false}
          isSendingMessage={isSendingMessage}
          messageText={messageText}
          onMessageTextChange={onMessageTextChange}
          onSendMessage={onSendMessage}
        />
      </TabPanel>
    </Box>
  )
}
