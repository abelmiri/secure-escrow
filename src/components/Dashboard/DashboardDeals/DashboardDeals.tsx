"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material"
import SearchIcon from "@/media/svg/SearchIcon"
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined"
import styles from "./styles/DashboardDeals.module.scss"
import { dealsData } from "@/constants/deals"

export default function DashboardDeals() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("همه")
  const [roleFilter, setRoleFilter] = useState("همه")
  const [orderFilter, setOrderFilter] = useState("newest")

  const filteredDeals = dealsData
    .filter((deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.participant.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "همه" || deal.status === statusFilter
      const matchesRole = roleFilter === "همه" || deal.role === roleFilter

      return matchesSearch && matchesStatus && matchesRole
    })
    .sort((a, b) => {
      if (orderFilter === "newest") {
        return b.date.localeCompare(a.date)
      } else {
        return a.date.localeCompare(b.date)
      }
    })

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
            onChange={(e) => setRoleFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <MenuItem value="همه">همه</MenuItem>
            <MenuItem value="خریدار">خریدار</MenuItem>
            <MenuItem value="فروشنده">فروشنده</MenuItem>
            <MenuItem value="کارگزار">کارگزار</MenuItem>
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
        {filteredDeals.map((deal) => (
          <Link
            key={deal.id}
            href={`/dashboard/${deal.id}`}
            style={{ textDecoration: "none" }}
          >
            <Box className={styles.dealCard}>
              <Box className={styles.dealCardHeader}>
                <Box className={styles.dealBadges}>
                  <Typography className={styles.dealId}>{deal.id}</Typography>
                  <span
                    className={`${styles.badge} ${styles[deal.statusType]}`}
                  >
                    {deal.status}
                  </span>
                  <span className={`${styles.badge} ${styles.roleBadge}`}>
                    {deal.role}
                  </span>
                </Box>
                <Typography className={styles.dealDate}>{deal.date}</Typography>
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
                    {deal.amount} <span className={styles.currency}>تومان</span>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  )
}
