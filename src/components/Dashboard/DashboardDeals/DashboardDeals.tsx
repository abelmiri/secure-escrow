"use client"

import React, { useEffect, useState } from "react"
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
} from "@mui/material"
import SearchIcon from "@/media/svg/SearchIcon"
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined"
import styles from "./styles/DashboardDeals.module.scss"
import { dealsData } from "@/constants/deals"
import { useDeals } from "@/hooks/deals/useDeals"

export default function DashboardDeals() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("همه")
  const [roleFilter, setRoleFilter] = useState("")
  const [orderFilter, setOrderFilter] = useState("newest")
  const [page, setPage] = useState(1)
  const limit = 10

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setPage(1)
    }, 400)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

  const {
    deals: apiDeals,
    isLoading,
    totalCount,
  } = useDeals({
    search: debouncedSearchTerm,
    role:
      roleFilter === ""
        ? undefined
        : (roleFilter as "customer" | "beneficiary" | "broker"),
    limit,
    offset: (page - 1) * limit,
  })

  // Mock data filtering (keep existing logic)
  const filteredMockDeals = dealsData.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.participant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "همه" || deal.status === statusFilter
    const roleLabels: Record<string, string> = {
      customer: "خریدار",
      beneficiary: "فروشنده",
      broker: "کارگزار",
    }
    const matchesRole =
      roleFilter === "" || deal.role === roleLabels[roleFilter]

    return matchesSearch && matchesStatus && matchesRole
  })

  // Combine Mock and API deals
  const allDeals = [
    ...filteredMockDeals.map((d) => ({ ...d, isMock: true })),
    ...apiDeals.map((d) => ({
      id: `API-${d.id}`,
      title: d.title,
      status: d.status || "نامشخص",
      statusType: "processing" as const, // Default for API deals
      role: "نامشخص" as const,
      participant: `مبلغ: ${d.amount.toLocaleString()} ریال`,
      date: new Date(d.created_at).toLocaleDateString("fa-IR"),
      amount: d.amount.toLocaleString(),
      isMock: false,
    })),
  ].sort((a, b) => {
    if (orderFilter === "newest") {
      return b.date.localeCompare(a.date)
    } else {
      return a.date.localeCompare(b.date)
    }
  })

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value)
  }

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
          <IconButton className={styles.filterButton}>
            <FilterAltOutlinedIcon sx={{ color: "#667085" }} />
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
              setRoleFilter(e.target.value)
              setPage(1)
            }}
            className={styles.filterSelect}
          >
            <MenuItem value="">همه</MenuItem>
            <MenuItem value="customer">خریدار</MenuItem>
            <MenuItem value="beneficiary">فروشنده</MenuItem>
            <MenuItem value="broker">کارگزار</MenuItem>
          </Select>
        </Box>

        <Box className={styles.filterGroup}>
          <Typography className={styles.filterLabel}>حالت معامله</Typography>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
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
                href={deal.isMock ? `/dashboard/${deal.id}` : "#"}
                style={{ textDecoration: "none" }}
              >
                <Box className={styles.dealCard}>
                  <Box className={styles.dealCardHeader}>
                    <Box className={styles.dealBadges}>
                      <Typography className={styles.dealId}>
                        {deal.id}
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
                        <span className={styles.currency}>تومان</span>
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
    </Box>
  )
}
