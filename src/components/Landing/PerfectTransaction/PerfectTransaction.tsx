"use client"

import { Box, Typography, Button } from "@mui/material"
import { useRouter } from "next/navigation"
import useUser from "@/context/auth/hooks/useUser"
import loginOAUTH from "@/helpers/auth/loginOAUTH"
import GlobeIcon from "@/media/svg/GlobeIcon"
import VehiclesIcon from "@/media/svg/VehiclesIcon"
import ValuablesIcon from "@/media/svg/ValuablesIcon"
import RealEstateIcon from "@/media/svg/RealEstateIcon"
import OnlineGoodsIcon from "@/media/svg/OnlineGoodsIcon"
import BusinessDealsIcon from "@/media/svg/BusinessDealsIcon"
import styles from "./styles/PerfectTransaction.module.scss"

const categories = [
  {
    title: "دامنه، وبسایت، اپلیکیشن و کالاهای الکترونیکی",
    description:
      "خرید و فروش دامنه‌ها، وبسایت‌ها، اپلیکیشن‌ها و کالاهای الکترونیکی با تضمین امنیت",
    Icon: GlobeIcon,
    iconBg: "linear-gradient(135deg, #00B8DB 0%, #155DFC 100%)", // Blue
  },
  {
    title: "وسایل نقلیه (خودرو و موتورسیکلت)",
    description: "خرید و فروش وسایل نقله شخصی و تجاری با امنیت کامل",
    Icon: VehiclesIcon,
    iconBg: "linear-gradient(135deg, #3CB95D 0%, #339D50 100%)",
  },
  {
    title: "املاک و مستغلات",
    description: "معاملات املاک و مستغلات، با تضمین حفاظت از دارایی‌ها",
    Icon: RealEstateIcon,
    iconBg: "linear-gradient(135deg, #FF6900 0%, #E7000B 100%)", // Orange
  },
  {
    title: "کالاهای عمومی در شبکه‌های اجتماعی",
    description:
      "خرید و فروش کالاهای مختلف از طریق شبکه‌های اجتماعی، با اطمینان از حفاظت از معامله",
    Icon: OnlineGoodsIcon,
    iconBg: "linear-gradient(135deg, #F6339A 0%, #EC003F 100%)", // Pink
  },
  {
    title: "طلا، نقره و فلزات گرانبها",
    description:
      "خرید و فروش طلا، نقره و فلزات گرانبها، با امنیت بالا و شفافیت",
    Icon: ValuablesIcon,
    iconBg: "linear-gradient(135deg, #00C950 0%, #009966 100%)", // Green
  },
  {
    title: "پرداخت‌های امن برای کسب‌وکارها",
    description: "انجام پرداخت‌ها و معاملات کسب‌وکارها، با اطمینان از شفافیت",
    Icon: BusinessDealsIcon,
    iconBg: "linear-gradient(135deg, #3CB95D 0%, #339D50 100%)",
  },
]

export default function PerfectTransaction() {
  const router = useRouter()
  const { isLoggedIn } = useUser()

  const handleStart = () => {
    if (isLoggedIn) {
      router.push("/contracts/create")
      return
    }

    loginOAUTH({ redirect: true, returnTo: "/contracts/create" })
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h2" className={styles.title}>
          مناسب برای هر نوع معامله
        </Typography>
        <Typography className={styles.subtitle}>
          خدمات پرداخت امانی (Escrow) برای صنایع مختلف
        </Typography>
      </Box>

      <Box className={styles.gridContainer}>
        {categories.map((category, index) => (
          <Box key={index} className={styles.card}>
            <Box
              className={styles.iconWrapper}
              style={{ background: category.iconBg }}
            >
              <category.Icon
                width={category.Icon === GlobeIcon ? 24 : 32}
                height={category.Icon === GlobeIcon ? 24 : 32}
                {...(category.Icon === GlobeIcon
                  ? { strokeColor: "white" }
                  : {})}
              />
            </Box>
            <Box className={styles.cardContent}>
              <Typography variant="h6" className={styles.cardTitle}>
                {category.title}
              </Typography>
              <Typography className={styles.cardDescription}>
                {category.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Button className={styles.viewAllButton} onClick={handleStart}>
        مشاهده تمام دسته‌بندی‌ها
      </Button>
    </Box>
  )
}
