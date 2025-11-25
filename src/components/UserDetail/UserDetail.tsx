"use client"

import {
  Container,
  Paper,
  Avatar,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material"
import {
  Email as EmailIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Login as LoginIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material"
import Link from "next/link"
import type { UserDetailProps } from "./types"
import styles from "./styles/UserDetail.module.scss"

export default function UserDetail({ user }: UserDetailProps) {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatShortDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleColor = (
    role: UserDetailProps["user"]["role"],
  ): "default" | "primary" | "secondary" => {
    switch (role) {
      case "admin":
        return "primary"
      case "user":
        return "default"
      case "guest":
        return "secondary"
      default:
        return "default"
    }
  }

  const getDaysSinceJoin = (joinDate: Date): number => {
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - joinDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Container maxWidth="md" className={styles.container}>
      <Button
        component={Link}
        href="/"
        startIcon={<ArrowBackIcon />}
        className={styles.backButton}
        sx={{ mb: 3 }}
      >
        Back to Home
      </Button>

      <Paper className={styles.paper} elevation={3}>
        <Box className={styles.header}>
          <Avatar
            src={user.avatar}
            alt={user.name}
            className={styles.avatar}
            sx={{ bgcolor: "var(--color-first)" }}
          >
            {!user.avatar && getInitials(user.name)}
          </Avatar>

          <Box className={styles.userHeaderInfo}>
            <Typography variant="h4" component="h1" className={styles.userName}>
              {user.name}
            </Typography>
            <Box className={styles.chips}>
              <Chip
                label={user.role}
                color={getRoleColor(user.role)}
                className={styles.roleChip}
              />
              <Chip
                label={user.isActive ? "Active" : "Inactive"}
                color={user.isActive ? "success" : "default"}
                className={styles.statusChip}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card className={styles.infoCard}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  className={styles.sectionTitle}
                >
                  Contact Information
                </Typography>
                <Box className={styles.infoItem}>
                  <EmailIcon className={styles.icon} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                </Box>

                {user.phone && (
                  <Box className={styles.infoItem}>
                    <PhoneIcon className={styles.icon} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">{user.phone}</Typography>
                    </Box>
                  </Box>
                )}

                {user.location && (
                  <Box className={styles.infoItem}>
                    <LocationIcon className={styles.icon} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1">{user.location}</Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className={styles.infoCard}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  className={styles.sectionTitle}
                >
                  Account Details
                </Typography>
                <Box className={styles.infoItem}>
                  <CalendarIcon className={styles.icon} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Joined Date
                    </Typography>
                    <Typography variant="body1">
                      {formatShortDate(user.joinDate)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getDaysSinceJoin(user.joinDate)} days ago
                    </Typography>
                  </Box>
                </Box>

                {user.lastLogin && (
                  <Box className={styles.infoItem}>
                    <LoginIcon className={styles.icon} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Last Login
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(user.lastLogin)}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {user.department && (
                  <Box className={styles.infoItem}>
                    <BusinessIcon className={styles.icon} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Department
                      </Typography>
                      <Typography variant="body1">{user.department}</Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {user.bio && (
            <Grid item xs={12}>
              <Card className={styles.infoCard}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    className={styles.sectionTitle}
                  >
                    About
                  </Typography>
                  <Typography variant="body1" className={styles.bio}>
                    {user.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  )
}
