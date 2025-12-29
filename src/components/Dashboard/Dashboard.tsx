"use client"

import { Box, Typography, Button } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DollarSign from "@/media/svg/DollarSign"
import CircleTime from "@/media/svg/CircleTime"
import CircleCheckIcon from "@/media/svg/CircleCheckIcon"
import TrendingUpIcon from "@/media/svg/TrendingUpIcon"
import DashboardDeals from "./DashboardDeals/DashboardDeals"
import styles from "./styles/Dashboard.module.scss"

const stats = [
  {
    title: "حجم کل",
    value: "۳۱۷,۰۰۰ تومان",
    change: "+۱۲.۵٪",
    Icon: DollarSign,
    iconColor: "#2563eb",
  },
  {
    title: "تراکنش‌های فعال",
    value: "۳",
    change: "+۲",
    Icon: CircleTime,
    iconColor: "#2563eb",
  },
  {
    title: "تکمیل شده",
    value: "۲",
    change: "+۱",
    Icon: CircleCheckIcon,
    iconColor: "#2563eb",
  },
  {
    title: "نرخ موفقیت",
    value: "۱۰۰٪",
    Icon: TrendingUpIcon,
    iconColor: "#2563eb",
  },
]

export default function Dashboard() {
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
          <Button variant="contained" className={styles.newTransactionButton}>
            <AddIcon sx={{ marginLeft: "8px" }} />
            معامله جدید
          </Button>
        </Box>

        <Box className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Box key={index} className={styles.statCard}>
              <Box className={styles.statIconContainer}>
                <stat.Icon
                  width={40}
                  height={40}
                  {...({
                    strokeColor: stat.iconColor,
                    color: stat.iconColor,
                  } as any)}
                />
              </Box>
              <Box className={styles.statInfo}>
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
              </Box>
            </Box>
          ))}
        </Box>

        <DashboardDeals />
      </Box>
    </Box>
  )
}
