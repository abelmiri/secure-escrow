import React from "react";
import { Box, Typography } from "@mui/material";
import DollarSign from "@/media/svg/DollarSign";
import GlobeIcon from "@/media/svg/GlobeIcon";
import Badge from "@/media/svg/Badge";
import styles from "./styles/AboutStats.module.scss";
import BuyerSeller from "@/media/svg/BuyerSeller";

const stats = [
  {
    icon: <BuyerSeller strokeColor="#155DFC" width="48" height="48" />,
    value: "500K+",
    label: "مشتری در سراسر جهان",
  },
  {
    icon: <DollarSign strokeColor="#155DFC" width={48} height={48} />,
    value: "$2.5B+",
    label: "تراکنش امن",
  },
  {
    icon: <GlobeIcon strokeColor="#155DFC" width={48} height={48} />,
    value: "150+",
    label: "کشور تحت پوشش",
  },
  {
    icon: <Badge strokeColor="#155DFC" width={48} height={48} />,
    value: "15+",
    label: "سال تجربه",
  },
];

export default function AboutStats() {
  return (
    <section className={styles.container}>
      {stats.map((stat, index) => (
        <Box key={index} className={styles.card}>
          <div className={styles.iconWrapper}>{stat.icon}</div>
          <Typography className={styles.value}>{stat.value}</Typography>
          <Typography className={styles.label}>{stat.label}</Typography>
        </Box>
      ))}
    </section>
  );
}

