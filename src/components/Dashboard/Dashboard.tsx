"use client"

import { useEffect, useMemo, useState, type ComponentType } from "react"
import { Box, Typography, Button, Skeleton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DollarSign from "@/media/svg/DollarSign"
import CircleTime from "@/media/svg/CircleTime"
import CircleCheckIcon from "@/media/svg/CircleCheckIcon"
import TrendingUpIcon from "@/media/svg/TrendingUpIcon"
import DashboardDeals from "./DashboardDeals/DashboardDeals"
import styles from "./styles/Dashboard.module.scss"
import Link from "next/link"
import request from "@/request/request"
import API_URLS from "@/constants/urls/API_URLS"

interface DashboardStatsResponse {
  total_amount: {
    value: number
    change_rate: number | null
  }
  active_deals: {
    value: number
    change: number | null
  }
  finished_deals: {
    value: number
    change: number | null
  }
  success_rate: number | null
}

interface StatCardItem {
  title: string
  value: string
  change?: string
  Icon: ComponentType<any>
  iconColor: string
}

const formatPersianNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—"
  }

  return Number(value).toLocaleString("fa-IR")
}

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] =
    useState<DashboardStatsResponse | null>(null)
  const [isStatsLoading, setIsStatsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadDashboardStats = async () => {
      try {
        const response = (await request.get({
          url: API_URLS.dashboardStats,
          dontToast: true,
        })) as DashboardStatsResponse

        if (isMounted) {
          setDashboardStats(response)
        }
      } catch {
        if (isMounted) {
          setDashboardStats(null)
        }
      } finally {
        if (isMounted) {
          setIsStatsLoading(false)
        }
      }
    }

    void loadDashboardStats()

    return () => {
      isMounted = false
    }
  }, [])

  const stats = useMemo<StatCardItem[]>(() => {
    if (isStatsLoading) {
      return Array.from({ length: 4 }).map((_, index) => ({
        title: "",
        value: "",
        change: undefined as string | undefined,
        Icon: [DollarSign, CircleTime, CircleCheckIcon, TrendingUpIcon][index],
        iconColor: "#2563eb",
      }))
    }

    if (!dashboardStats) {
      return [
        {
          title: "حجم کل",
          value: "—",
          Icon: DollarSign,
          iconColor: "#2563eb",
        },
        {
          title: "تراکنش‌های فعال",
          value: "—",
          Icon: CircleTime,
          iconColor: "#2563eb",
        },
        {
          title: "تکمیل شده",
          value: "—",
          Icon: CircleCheckIcon,
          iconColor: "#2563eb",
        },
        {
          title: "نرخ موفقیت",
          value: "—",
          Icon: TrendingUpIcon,
          iconColor: "#2563eb",
        },
      ]
    }

    return [
      {
        title: "حجم کل",
        value: `${formatPersianNumber(dashboardStats.total_amount.value)} تومان`,
        change:
          dashboardStats.total_amount.change_rate !== null
            ? `${dashboardStats.total_amount.change_rate >= 0 ? "+" : ""}${formatPersianNumber(dashboardStats.total_amount.change_rate)}٪`
            : undefined,
        Icon: DollarSign,
        iconColor: "#2563eb",
      },
      {
        title: "تراکنش‌های فعال",
        value: formatPersianNumber(dashboardStats.active_deals.value),
        change:
          dashboardStats.active_deals.change !== null
            ? `${dashboardStats.active_deals.change >= 0 ? "+" : ""}${formatPersianNumber(dashboardStats.active_deals.change)}`
            : undefined,
        Icon: CircleTime,
        iconColor: "#2563eb",
      },
      {
        title: "تکمیل شده",
        value: formatPersianNumber(dashboardStats.finished_deals.value),
        change:
          dashboardStats.finished_deals.change !== null
            ? `${dashboardStats.finished_deals.change >= 0 ? "+" : ""}${formatPersianNumber(dashboardStats.finished_deals.change)}`
            : undefined,
        Icon: CircleCheckIcon,
        iconColor: "#2563eb",
      },
      {
        title: "نرخ موفقیت",
        value: `${formatPersianNumber(dashboardStats.success_rate)}٪`,
        Icon: TrendingUpIcon,
        iconColor: "#2563eb",
      },
    ]
  }, [dashboardStats, isStatsLoading])

  return (
    <Box className={styles.mainWrapper}>
      <Box className={styles.container}>
        <Box className={styles.header}>
          <Box className={styles.headerRight}>
            <Typography variant="h1" className={styles.title}>
              داشبورد
            </Typography>
            <Typography className={styles.subtitle}>
              خوش آمدید! نمای کلی معاملات شما در داشبورد قابل مشاهده است.
            </Typography>
          </Box>
          <Link href="/contracts/create">
            <Button variant="contained" className={styles.newTransactionButton}>
              <AddIcon sx={{ marginLeft: "8px" }} />
              <Typography>معامله جدید</Typography>
            </Button>
          </Link>
        </Box>

        <Box className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Box key={index} className={styles.statCard}>
              <Box className={styles.statIconContainer}>
                {isStatsLoading ? (
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    animation="wave"
                  />
                ) : (
                  <stat.Icon
                    width={40}
                    height={40}
                    {...({
                      strokeColor: stat.iconColor,
                      color: stat.iconColor,
                    } as any)}
                  />
                )}
              </Box>
              <Box className={styles.statInfo}>
                {isStatsLoading ? (
                  <>
                    <Skeleton
                      variant="text"
                      width={100}
                      height={20}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width={120}
                      height={32}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width={70}
                      height={20}
                      animation="wave"
                    />
                  </>
                ) : (
                  <>
                    <Typography className={styles.statTitle}>
                      {stat.title}
                    </Typography>
                    <Typography className={styles.statValue}>
                      {stat.value}
                    </Typography>
                    {stat.change && (
                      <Box className={styles.statChangeContainer}>
                        <Typography className={styles.statChange}>
                          {stat.change}
                          <TrendingUpIcon
                            width={14}
                            height={14}
                            strokeColor="#10b981"
                          />
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        <DashboardDeals />
      </Box>
    </Box>
  )
}
