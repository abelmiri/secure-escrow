"use client"

import { useEffect, useState, MouseEvent } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Avatar,
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined"
import CheckIcon from "@mui/icons-material/Check"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import IconSvg from "@/media/svg/IconSvg"
import useUser from "@/context/auth/hooks/useUser"
import resetDataManager from "@/helpers/storage/resetDataManager"
import styles from "./styles/Header.module.scss"
import loginOAUTH from "@/helpers/auth/loginOAUTH"
import {
  getSelectedRepresentedPartner,
  profileSelectionChangedEvent,
  type SelectedRepresentedPartner,
  setSelectedRepresentedPartner,
} from "@/helpers/auth/profileSelection"

const resources = [
  { label: "سوالات متداول", href: "/faq" },
  { label: "اعتماد و امنیت", href: "/trust-and-safety" },
  { label: "نحوه‌ی عملکرد", href: "/how-it-works" },
  { label: "درباره ما", href: "/about" },
  { label: "قوانین و مقررات", href: "/terms-and-conditions" },
  // { label: "وبلاگ", href: "#" },
  // { label: "مرکز راهنما", href: "#" },
  // { label: "مستندات API", href: "#" },
  // { label: "کارمزدها", href: "#" },
  // { label: "امنیت", href: "#" },
]

const solutions = [
  "امان یار برای دامنه‌ها",
  "امان یار برای وسایل نقلیه",
  "امان یار برای کالاها",
  "معاملات مرحله‌ای",
  "معاملات کارگزاری",
  "نگهداشت عنوان",
]

const getInitial = (name: string) => {
  return Array.from(name.trim())[0] || "پ"
}

export default function Header() {
  const { user, isLoggedIn } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  const [anchorElResources, setAnchorElResources] =
    useState<null | HTMLElement>(null)
  const [anchorElSolutions, setAnchorElSolutions] =
    useState<null | HTMLElement>(null)
  const [anchorElBrokers, setAnchorElBrokers] = useState<null | HTMLElement>(
    null,
  )
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(
    null,
  )
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false)
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false)
  const [mobileBrokersOpen, setMobileBrokersOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] =
    useState<SelectedRepresentedPartner | null>(() =>
      getSelectedRepresentedPartner(),
    )

  const representedPartners = user?.represented_partners ?? []
  const hasRepresentedPartners = representedPartners.length > 0
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()
  const personalProfileName =
    fullName || user?.username || user?.mobile_number || "پروفایل شخصی"
  const profileOptions: SelectedRepresentedPartner[] = [
    { type: "personal", id: null, name: personalProfileName },
    ...representedPartners.map((partner) => ({
      type: "partner" as const,
      id: partner.id,
      name: partner.name,
    })),
  ]
  const selectedHeaderProfile =
    profileOptions.find(
      (profile) =>
        selectedProfile?.type === profile.type &&
        String(selectedProfile?.id) === String(profile.id),
    ) ?? profileOptions[0]
  const headerProfileImage =
    selectedHeaderProfile?.type === "personal" ? user?.image : null
  const headerProfileInitial = getInitial(selectedHeaderProfile?.name ?? "")
  const profileHref = "/profile"

  const handleOpenResources = (event: MouseEvent<HTMLElement>) => {
    setAnchorElResources(event.currentTarget)
  }

  const handleCloseResources = () => {
    setAnchorElResources(null)
  }

  const handleOpenSolutions = (event: MouseEvent<HTMLElement>) => {
    setAnchorElSolutions(event.currentTarget)
  }

  const handleCloseSolutions = () => {
    setAnchorElSolutions(null)
  }

  const handleOpenBrokers = (event: MouseEvent<HTMLElement>) => {
    setAnchorElBrokers(event.currentTarget)
  }

  const handleCloseBrokers = () => {
    setAnchorElBrokers(null)
  }

  const handleOpenProfileMenu = (event: MouseEvent<HTMLElement>) => {
    if (!hasRepresentedPartners) {
      router.push(profileHref)
      return
    }

    setAnchorElProfile(event.currentTarget)
  }

  const handleCloseProfileMenu = () => {
    setAnchorElProfile(null)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMobileResourcesToggle = () => {
    setMobileResourcesOpen(!mobileResourcesOpen)
  }

  const handleMobileSolutionsToggle = () => {
    setMobileSolutionsOpen(!mobileSolutionsOpen)
  }

  const handleMobileBrokersToggle = () => {
    setMobileBrokersOpen(!mobileBrokersOpen)
  }

  function login() {
    loginOAUTH()
  }

  const handleSelectProfile = (profile: SelectedRepresentedPartner) => {
    setSelectedRepresentedPartner(profile)
    setSelectedProfile(profile)
    handleCloseProfileMenu()
  }

  const isSelectedProfile = (profile: SelectedRepresentedPartner) => {
    return (
      selectedProfile?.type === profile.type &&
      String(selectedProfile?.id) === String(profile.id)
    )
  }

  const handleLogout = () => {
    router.replace("/")
    resetDataManager.resetData({ isAfterLogin: false, sendLogoutReq: true })
  }

  useEffect(() => {
    const handleProfileSelectionChange = () => {
      setSelectedProfile(getSelectedRepresentedPartner())
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

  return (
    <Box component="header" className={styles.header}>
      <Box className={styles.rightSection}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
          }}
        >
          <Box className={styles.iconContainer}>
            <IconSvg className={styles.icon} />
          </Box>
        </Link>

        {isLoggedIn && (
          <Box className={styles.desktopNav}>
            <Link href="/dashboard" className={styles.navLink}>
              <Typography
                className={`${styles.navItem} ${
                  pathname === "/dashboard" ? styles.activeNavItem : ""
                }`}
              >
                داشبورد
              </Typography>
            </Link>
            <Link href="/contracts/create" className={styles.navLink}>
              <Typography
                className={`${styles.navItem} ${
                  pathname === "/contracts/create" ? styles.activeNavItem : ""
                }`}
              >
                تراکنش جدید
              </Typography>
            </Link>
            <Box
              className={styles.navItem}
              onClick={handleOpenResources}
              aria-controls={
                Boolean(anchorElResources) ? "resources-menu" : undefined
              }
              aria-haspopup="true"
              aria-expanded={Boolean(anchorElResources) ? "true" : undefined}
            >
              منابع
              <KeyboardArrowDownIcon fontSize="small" />
            </Box>
            <Box
              className={styles.navItem}
              onClick={handleOpenBrokers}
              aria-controls={
                Boolean(anchorElBrokers) ? "brokers-menu" : undefined
              }
              aria-haspopup="true"
              aria-expanded={Boolean(anchorElBrokers) ? "true" : undefined}
            >
              کارگزاران
              <KeyboardArrowDownIcon fontSize="small" />
            </Box>
            <Link href={profileHref} className={styles.navLink}>
              <Typography
                className={`${styles.navItem} ${
                  pathname === profileHref ? styles.activeNavItem : ""
                }`}
              >
                پروفایل
              </Typography>
            </Link>
          </Box>
        )}
      </Box>

      <Box className={styles.leftSection}>
        {/* Desktop Navigation */}
        <Box className={styles.navContainer}>
          {isLoggedIn ? (
            <Button className={styles.logoutButton} onClick={handleLogout}>
              خروج
            </Button>
          ) : (
            <>
              {!isLoggedIn && (
                <Button className={styles.startButton} onClick={login}>
                  شروع کنید
                </Button>
              )}

              <Button className={styles.loginButton} onClick={login}>
                ورود
              </Button>

              <Typography className={styles.navItem}>تماس با ما</Typography>

              <Link
                href="/about"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography className={styles.navItem}>درباره ما</Typography>
              </Link>

              <Box
                className={styles.navItem}
                onClick={handleOpenResources}
                aria-controls={
                  Boolean(anchorElResources) ? "resources-menu" : undefined
                }
                aria-haspopup="true"
                aria-expanded={Boolean(anchorElResources) ? "true" : undefined}
              >
                منابع
                <KeyboardArrowDownIcon fontSize="small" />
              </Box>

              <Typography className={styles.navItem}>قیمت گذاری</Typography>

              <Box
                className={styles.navItem}
                onClick={handleOpenBrokers}
                aria-controls={
                  Boolean(anchorElBrokers) ? "brokers-menu" : undefined
                }
                aria-haspopup="true"
                aria-expanded={Boolean(anchorElBrokers) ? "true" : undefined}
              >
                کارگزاران
                <KeyboardArrowDownIcon fontSize="small" />
              </Box>

              <Box
                className={styles.navItem}
                onClick={handleOpenSolutions}
                aria-controls={
                  Boolean(anchorElSolutions) ? "solutions-menu" : undefined
                }
                aria-haspopup="true"
                aria-expanded={Boolean(anchorElSolutions) ? "true" : undefined}
              >
                راهکارها
                <KeyboardArrowDownIcon fontSize="small" />
              </Box>
            </>
          )}
        </Box>

        {isLoggedIn && (
          <IconButton
            aria-label="انتخاب پروفایل"
            aria-controls={
              Boolean(anchorElProfile) ? "profile-menu" : undefined
            }
            aria-haspopup={hasRepresentedPartners ? "true" : undefined}
            aria-expanded={Boolean(anchorElProfile) ? "true" : undefined}
            className={styles.profileButton}
            onClick={handleOpenProfileMenu}
          >
            <Avatar
              className={`${styles.profileAvatar} ${
                selectedHeaderProfile?.type === "partner"
                  ? styles.partnerProfileAvatar
                  : ""
              }`}
              src={headerProfileImage || undefined}
            >
              {headerProfileInitial}
            </Avatar>
          </IconButton>
        )}

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={styles.mobileMenuButton}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <Menu
        id="resources-menu"
        anchorEl={anchorElResources}
        open={Boolean(anchorElResources)}
        onClose={handleCloseResources}
        classes={{ paper: styles.menuPaper, list: styles.menuList }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {resources.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <MenuItem
              onClick={handleCloseResources}
              className={styles.menuItem}
            >
              {item.label}
            </MenuItem>
          </Link>
        ))}
      </Menu>

      <Menu
        id="brokers-menu"
        anchorEl={anchorElBrokers}
        open={Boolean(anchorElBrokers)}
        onClose={handleCloseBrokers}
        classes={{ paper: styles.menuPaper, list: styles.menuList }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Link
          href="/partners/request"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <MenuItem onClick={handleCloseBrokers} className={styles.menuItem}>
            درخواست همکاری
          </MenuItem>
        </Link>
      </Menu>

      <Menu
        id="solutions-menu"
        anchorEl={anchorElSolutions}
        open={Boolean(anchorElSolutions)}
        onClose={handleCloseSolutions}
        classes={{ paper: styles.menuPaper, list: styles.menuList }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {solutions.map((item) => (
          <MenuItem
            key={item}
            onClick={handleCloseSolutions}
            className={styles.menuItem}
          >
            {item}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        id="profile-menu"
        anchorEl={anchorElProfile}
        open={Boolean(anchorElProfile)}
        onClose={handleCloseProfileMenu}
        classes={{ paper: styles.menuPaper, list: styles.profileMenuList }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        {profileOptions.map((profile) => (
          <MenuItem
            key={`${profile.type}-${profile.id}`}
            onClick={() => handleSelectProfile(profile)}
            className={`${styles.profileMenuItem} ${
              isSelectedProfile(profile) ? styles.selectedProfileMenuItem : ""
            }`}
          >
            <Avatar
              className={`${styles.profileMenuAvatar} ${
                profile.type === "partner" ? styles.partnerMenuAvatar : ""
              }`}
              src={
                profile.type === "personal"
                  ? user?.image || undefined
                  : undefined
              }
            >
              {profile.type === "partner" ? (
                getInitial(profile.name)
              ) : (
                <PersonOutlineIcon fontSize="inherit" />
              )}
            </Avatar>
            <Box className={styles.profileMenuText}>
              <Typography className={styles.profileMenuTitle}>
                {profile.name}
              </Typography>
              <Typography className={styles.profileMenuSubtitle}>
                {profile.type === "partner"
                  ? "پروفایل کسب‌وکار"
                  : "پروفایل شخصی"}
              </Typography>
            </Box>
            {profile.type === "partner" ? (
              <BusinessOutlinedIcon className={styles.profileMenuTypeIcon} />
            ) : null}
            {isSelectedProfile(profile) && (
              <CheckIcon className={styles.profileMenuCheckIcon} />
            )}
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        classes={{ paper: styles.drawerPaper }}
      >
        <Box className={styles.drawerHeader}>
          <Box className={styles.rightSection}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
              }}
              onClick={handleDrawerToggle}
            >
              <Box className={styles.iconContainer}>
                <IconSvg className={styles.icon} />
              </Box>
            </Link>
          </Box>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List className={styles.drawerList}>
          {isLoggedIn ? (
            <>
              <ListItem disablePadding className={styles.drawerItem}>
                <Link
                  href="/dashboard"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  onClick={handleDrawerToggle}
                >
                  <ListItemButton>
                    <ListItemText
                      primary="داشبورد"
                      className={styles.drawerItemText}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>

              <ListItem disablePadding className={styles.drawerItem}>
                <Link
                  href="/contracts/create"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  onClick={handleDrawerToggle}
                >
                  <ListItemButton>
                    <ListItemText
                      primary="تراکنش جدید"
                      className={styles.drawerItemText}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>

              <ListItem disablePadding className={styles.drawerItem}>
                <ListItemButton onClick={handleMobileResourcesToggle}>
                  <ListItemText
                    primary="منابع"
                    className={styles.drawerItemText}
                  />
                  {mobileResourcesOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={mobileResourcesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {resources.map((item) => (
                    <ListItem
                      key={item.label}
                      disablePadding
                      className={styles.drawerSubItem}
                    >
                      <Link
                        href={item.href}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          width: "100%",
                        }}
                        onClick={handleDrawerToggle}
                      >
                        <ListItemButton>
                          <ListItemText primary={item.label} />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Collapse>

              <ListItem disablePadding className={styles.drawerItem}>
                <ListItemButton onClick={handleMobileBrokersToggle}>
                  <ListItemText
                    primary="کارگزاران"
                    className={styles.drawerItemText}
                  />
                  {mobileBrokersOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={mobileBrokersOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem disablePadding className={styles.drawerSubItem}>
                    <Link
                      href="/partners/request"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        width: "100%",
                      }}
                      onClick={handleDrawerToggle}
                    >
                      <ListItemButton>
                        <ListItemText primary="درخواست همکاری" />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                </List>
              </Collapse>

              <ListItem disablePadding className={styles.drawerItem}>
                <Link
                  href={profileHref}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  onClick={handleDrawerToggle}
                >
                  <ListItemButton>
                    <ListItemText
                      primary="پروفایل"
                      className={styles.drawerItemText}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding className={styles.drawerItem}>
                <ListItemButton>
                  <ListItemText
                    primary="تماس با ما"
                    className={styles.drawerItemText}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding className={styles.drawerItem}>
                <Link
                  href="/about"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                  onClick={handleDrawerToggle}
                >
                  <ListItemButton>
                    <ListItemText
                      primary="درباره ما"
                      className={styles.drawerItemText}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>

              <ListItem disablePadding className={styles.drawerItem}>
                <ListItemButton onClick={handleMobileResourcesToggle}>
                  <ListItemText
                    primary="منابع"
                    className={styles.drawerItemText}
                  />
                  {mobileResourcesOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={mobileResourcesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {resources.map((item) => (
                    <ListItem
                      key={item.label}
                      disablePadding
                      className={styles.drawerSubItem}
                    >
                      <Link
                        href={item.href}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          width: "100%",
                        }}
                        onClick={handleDrawerToggle}
                      >
                        <ListItemButton>
                          <ListItemText primary={item.label} />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Collapse>

              <ListItem disablePadding className={styles.drawerItem}>
                <ListItemButton>
                  <ListItemText
                    primary="قیمت گذاری"
                    className={styles.drawerItemText}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding className={styles.drawerItem}>
                <ListItemButton onClick={handleMobileBrokersToggle}>
                  <ListItemText
                    primary="کارگزاران"
                    className={styles.drawerItemText}
                  />
                  {mobileBrokersOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={mobileBrokersOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem disablePadding className={styles.drawerSubItem}>
                    <Link
                      href="/partners/request"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        width: "100%",
                      }}
                      onClick={handleDrawerToggle}
                    >
                      <ListItemButton>
                        <ListItemText primary="درخواست همکاری" />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                </List>
              </Collapse>

              <ListItem disablePadding className={styles.drawerItem}>
                <ListItemButton onClick={handleMobileSolutionsToggle}>
                  <ListItemText
                    primary="راهکارها"
                    className={styles.drawerItemText}
                  />
                  {mobileSolutionsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={mobileSolutionsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {solutions.map((item) => (
                    <ListItem
                      key={item}
                      disablePadding
                      className={styles.drawerSubItem}
                    >
                      <ListItemButton onClick={handleDrawerToggle}>
                        <ListItemText primary={item} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </>
          )}

          <Box className={styles.drawerButtons}>
            {isLoggedIn ? (
              <Button
                className={styles.loginButton}
                fullWidth
                onClick={handleLogout}
              >
                خروج
              </Button>
            ) : (
              <>
                <Button
                  className={styles.loginButton}
                  fullWidth
                  onClick={login}
                >
                  ورود
                </Button>
                <Button
                  className={styles.startButton}
                  fullWidth
                  onClick={login}
                >
                  شروع کنید
                </Button>
              </>
            )}
          </Box>
        </List>
      </Drawer>
    </Box>
  )
}
