"use client"

import React, { useContext, useEffect, useState } from "react"
import Link from "next/link"
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  CircularProgress,
  Pagination,
  Button,
  Checkbox,
  Dialog,
  Divider,
  FormControlLabel,
} from "@mui/material"
import SearchIcon from "@/media/svg/SearchIcon"
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined"
import CloseIcon from "@mui/icons-material/Close"
import styles from "./styles/DashboardDeals.module.scss"
import { authContext } from "@/context/auth/authProvider"
import { useDeals } from "@/hooks/deals/useDeals"
import type { DealRole } from "@/hooks/deals/useDeals"
import { getPartyMobileNumber, getPartyPartnerId } from "@/hooks/deals/useDeal"
import {
  getSelectedRepresentedPartner,
  profileSelectionChangedEvent,
  type SelectedRepresentedPartner,
} from "@/helpers/auth/profileSelection"

type RoleFilter = DealRole | ""
type StatusType = "processing" | "pending" | "inspection" | "completed"
type ActivityFilter = "active" | "completed"
type ActivityFilters = Record<ActivityFilter, boolean>

interface DashboardDealsProps {
  activityFilters: ActivityFilters
  onActivityFilterToggle: (filter: ActivityFilter) => void
  onActivityFiltersClear: () => void
}

type DashboardDealCard = {
  id: string
  label: string
  href: string
  title: string
  status: string
  statusType: StatusType
  role: string
  participant: string
  date: string
  timestamp: number
  amount: string
  currency: "تومان" | "ریال"
  isMock: boolean
}

const roleLabels: Record<string, string> = {
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

const resolveStatusLabel = (
  state: string,
  subState: number | string | null,
) => {
  if (state === "Created" && subState === 1) return "ایجاد شده"
  return statusLabels[state] || state || "نامشخص"
}

const resolveStatusType = (status: string): StatusType => {
  if (status === "تکمیل شده") return "completed"
  if (status === "در انتظار پرداخت" || status === "در انتظار") return "pending"
  if (status === "دوره بازرسی") return "inspection"
  return "processing"
}

const getTimestamp = (date: string) => {
  const timestamp = new Date(date).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const activityFilterOptions: Array<{ value: ActivityFilter; label: string }> = [
  { value: "active", label: "نمایش معامله‌های فعال" },
  { value: "completed", label: "نمایش معامله‌های تکمیل‌شده" },
]

export default function DashboardDeals({
  activityFilters,
  onActivityFilterToggle,
  onActivityFiltersClear,
}: DashboardDealsProps) {
  const { authState } = useContext(authContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("همه")
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("")
  const [orderFilter, setOrderFilter] = useState("newest")
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] =
    useState<SelectedRepresentedPartner | null>(() =>
      getSelectedRepresentedPartner(),
    )
  const [page, setPage] = useState(1)
  const limit = 10
  const selectedBrokerId =
    selectedProfile?.type === "partner" &&
    authState.user?.represented_partners?.some(
      (partner) => String(partner.id) === String(selectedProfile.id),
    )
      ? selectedProfile.id
      : null

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setPage(1)
    }, 400)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

  useEffect(() => {
    const handleProfileSelectionChange = () => {
      setSelectedProfile(getSelectedRepresentedPartner())
      setPage(1)
    }

    window.addEventListener(
      profileSelectionChangedEvent,
      handleProfileSelectionChange,
    )
    window.addEventListener("storage", handleProfileSelectionChange)

    return () => {
      window.removeEventListener(
        profileSelectionChangedEvent,
        handleProfileSelectionChange,
      )
      window.removeEventListener("storage", handleProfileSelectionChange)
    }
  }, [])

  const {
    deals: apiDeals,
    isLoading,
    totalCount,
  } = useDeals({
    search: debouncedSearchTerm,
    role: roleFilter || undefined,
    brokerId: selectedBrokerId,
    limit,
    offset: (page - 1) * limit,
  })

  const currentUserMobile = authState.user?.mobile_number

  // Static sample deals are intentionally hidden; dashboard now shows API data only.
  const filteredMockDeals: DashboardDealCard[] = []

  const mappedApiDeals: DashboardDealCard[] = apiDeals.map((deal) => {
    const currentParty = selectedBrokerId
      ? deal.parties.find(
          (party) =>
            party.role === "broker" &&
            getPartyPartnerId(party) === String(selectedBrokerId),
        )
      : currentUserMobile
        ? deal.parties.find(
            (party) => getPartyMobileNumber(party) === currentUserMobile,
          )
        : undefined
    const counterparty = currentUserMobile
      ? deal.parties.find((party) => {
          const partyMobile = getPartyMobileNumber(party)
          return partyMobile && partyMobile !== currentUserMobile
        })
      : deal.parties.find((party) => getPartyMobileNumber(party))
    const status = resolveStatusLabel(deal.state, deal.subState)

    return {
      id: `#${deal.id}`,
      label: deal.label,
      href: `/dashboard/${deal.id}`,
      title: deal.title,
      status,
      statusType: resolveStatusType(status),
      role: currentParty?.role ? roleLabels[currentParty.role] : "نامشخص",
      participant: counterparty
        ? `طرف مقابل: ${getPartyMobileNumber(counterparty)}`
        : deal.traceNumber
          ? `کد پیگیری: ${deal.traceNumber}`
          : "طرف مقابل ثبت نشده",
      date: new Date(deal.created_at).toLocaleDateString("fa-IR"),
      timestamp: getTimestamp(deal.created_at),
      amount: deal.amount.toLocaleString("fa-IR"),
      currency: "ریال",
      isMock: false,
    }
  })

  const allDeals = [...filteredMockDeals, ...mappedApiDeals]
    .filter((deal) => statusFilter === "همه" || deal.status === statusFilter)
    .sort((a, b) => {
      if (orderFilter === "newest") {
        return b.timestamp - a.timestamp
      } else {
        return a.timestamp - b.timestamp
      }
    })

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value)
  }

  const hasActiveActivityFilter = Object.values(activityFilters).some(Boolean)

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h2" className={styles.title}>
          معامله‌ها
        </Typography>
        <Box className={styles.searchWrapper}>
          <TextField
            fullWidth
            placeholder="جستجوی معامله‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="#667085" />
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            className={`${styles.filterButton} ${
              hasActiveActivityFilter ? styles.filterButtonActive : ""
            }`}
            onClick={() => setIsFilterDialogOpen(true)}
            aria-label="فیلتر وضعیت معامله‌ها"
            aria-pressed={hasActiveActivityFilter}
          >
            <FilterAltOutlinedIcon
              sx={{
                color: hasActiveActivityFilter
                  ? "var(--color-secondary)"
                  : "#667085",
              }}
            />
          </IconButton>
        </Box>
      </Box>

      <Box className={styles.filtersRow}>
        <Box className={styles.filterGroup}>
          <Typography className={styles.filterLabel}>ترتیب زمانی</Typography>
          <Select
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <MenuItem value="newest">از جدید ترین به قدیمی ترین</MenuItem>
            <MenuItem value="oldest">از قدیمی ترین به جدید ترین</MenuItem>
          </Select>
        </Box>

        <Box className={styles.filterGroup}>
          <Typography className={styles.filterLabel}>نقش شما</Typography>
          <Select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as RoleFilter)
              setPage(1)
            }}
            className={styles.filterSelect}
            displayEmpty
          >
            <MenuItem value="">همه</MenuItem>
            <MenuItem value="customer">خریدار</MenuItem>
            <MenuItem value="beneficiary">فروشنده</MenuItem>
            <MenuItem value="broker">کارگزار</MenuItem>
          </Select>
        </Box>

        <Box className={styles.filterGroup}>
          <Typography className={styles.filterLabel}>وضعیت معامله</Typography>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
            disabled
          >
            <MenuItem value="همه">همه</MenuItem>
            <MenuItem value="در حال انجام">در حال انجام</MenuItem>
            <MenuItem value="در انتظار پرداخت">در انتظار پرداخت</MenuItem>
            <MenuItem value="دوره بازرسی">دوره بازرسی</MenuItem>
            <MenuItem value="تکمیل شده">تکمیل شده</MenuItem>
          </Select>
        </Box>
      </Box>

      <Box className={styles.dealsList}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <CircularProgress size={32} />
          </Box>
        ) : (
          <>
            {allDeals.map((deal) => (
              <Link
                key={deal.id}
                href={deal.href}
                style={{ textDecoration: "none" }}
              >
                <Box className={styles.dealCard}>
                  <Box className={styles.dealCardHeader}>
                    <Box className={styles.dealBadges}>
                      <Typography className={styles.dealId}>
                        {deal.label}
                      </Typography>
                      <span
                        className={`${styles.badge} ${styles[deal.statusType]}`}
                      >
                        {deal.status}
                      </span>
                      {deal.role !== "نامشخص" && (
                        <span className={`${styles.badge} ${styles.roleBadge}`}>
                          {deal.role}
                        </span>
                      )}
                    </Box>
                    <Typography className={styles.dealDate}>
                      {deal.date}
                    </Typography>
                  </Box>

                  <Box className={styles.dealCardContent}>
                    <Box className={styles.dealInfo}>
                      <Typography className={styles.dealTitle}>
                        {deal.title}
                      </Typography>
                      <Typography className={styles.dealParticipant}>
                        {deal.participant}
                      </Typography>
                    </Box>
                    <Box className={styles.dealAmountContainer}>
                      <Typography className={styles.dealAmount}>
                        {deal.amount}{" "}
                        <span className={styles.currency}>{deal.currency}</span>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Link>
            ))}

            {totalCount > limit && (
              <Box className={styles.paginationWrapper}>
                <Pagination
                  count={Math.ceil(totalCount / limit)}
                  page={page}
                  onChange={handlePageChange}
                  color="standard"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </Box>

      <Dialog
        open={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: { className: styles.filterDialogPaper },
        }}
      >
        <Box className={styles.filterDialog}>
          <Box className={styles.filterDialogHeader}>
            <Box>
              <Typography className={styles.filterDialogTitle}>
                فیلتر معامله‌ها
              </Typography>
              <Typography className={styles.filterDialogDescription}>
                وضعیت معامله‌هایی که می‌خواهید مشاهده کنید را انتخاب کنید.
              </Typography>
            </Box>
            <IconButton
              className={styles.filterDialogCloseButton}
              onClick={() => setIsFilterDialogOpen(false)}
              aria-label="بستن فیلترها"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider className={styles.filterDialogDivider} />

          <Box className={styles.filterOptions}>
            {activityFilterOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                className={styles.filterOption}
                control={
                  <Checkbox
                    checked={activityFilters[option.value]}
                    onChange={() => onActivityFilterToggle(option.value)}
                  />
                }
                label={option.label}
              />
            ))}
          </Box>

          <Box className={styles.filterDialogActions}>
            <Button
              className={styles.clearFiltersButton}
              onClick={onActivityFiltersClear}
              disabled={!hasActiveActivityFilter}
            >
              پاک کردن
            </Button>
            <Button
              variant="contained"
              className={styles.confirmFiltersButton}
              onClick={() => setIsFilterDialogOpen(false)}
            >
              تأیید
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}
