"use client"

import { useState, MouseEvent } from "react"
import Link from "next/link"
import {
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
import SecureEscrow from "@/media/svg/SecureEscrow"
import styles from "./styles/Header.module.scss"
import loginOAUTH from "@/helpers/auth/loginOAUTH"

const resources = [
  { label: "وبلاگ", href: "#" },
  { label: "مرکز راهنما", href: "#" },
  { label: "سوالات متداول", href: "/faq" },
  { label: "مستندات API", href: "#" },
  { label: "کارمزدها", href: "#" },
  { label: "امنیت", href: "#" },
  { label: "شرکای تجاری", href: "#" },
]

const solutions = [
  "اسکرو برای دامنه‌ها",
  "اسکرو برای وسایل نقلیه",
  "اسکرو برای کالاها",
  "معاملات مرحله‌ای",
  "معاملات کارگزاری",
  "نگهداشت عنوان",
]

export default function Header() {
  const [anchorElResources, setAnchorElResources] =
    useState<null | HTMLElement>(null)
  const [anchorElSolutions, setAnchorElSolutions] =
    useState<null | HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false)
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false)

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMobileResourcesToggle = () => {
    setMobileResourcesOpen(!mobileResourcesOpen)
  }

  const handleMobileSolutionsToggle = () => {
    setMobileSolutionsOpen(!mobileSolutionsOpen)
  }

  function login() {
    loginOAUTH()
  }

  return (
    <Box component="header" className={styles.header}>
      <Box className={styles.rightSection}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Box className={styles.iconContainer}>
            <SecureEscrow
              width={20}
              height={20}
              className={styles.icon}
              strokeColor="white"
            />
          </Box>
          <Typography className={styles.title}>سکیوراسکرو</Typography>
        </Link>
      </Box>

      {/* Desktop Navigation */}
      <Box className={styles.navContainer}>
        <Button className={styles.startButton} onClick={login}>شروع کنید</Button>

        <Button className={styles.loginButton} onClick={login}>ورود</Button>

        <Typography className={styles.navItem}>تماس با ما</Typography>

        <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
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
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <MenuItem
                onClick={handleCloseResources}
                className={styles.menuItem}
              >
                {item.label}
              </MenuItem>
            </Link>
          ))}
        </Menu>

        <Typography className={styles.navItem}>قیمت گذاری</Typography>

        <Box
          className={styles.navItem}
          onClick={handleOpenSolutions}
          aria-controls={
            Boolean(anchorElSolutions) ? "solutions-menu" : undefined
          }
          aria-haspopup="true"
          aria-expanded={Boolean(anchorElSolutions) ? "true" : undefined}
        >
          راه حل ها
          <KeyboardArrowDownIcon fontSize="small" />
        </Box>
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
      </Box>

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

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        classes={{ paper: styles.drawerPaper }}
      >
        <Box className={styles.drawerHeader}>
          <Box className={styles.rightSection}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }} onClick={handleDrawerToggle}>
              <Box className={styles.iconContainer}>
                <SecureEscrow
                  width={20}
                  height={20}
                  className={styles.icon}
                  strokeColor="white"
                />
              </Box>
              <Typography className={styles.title}>سکیوراسکرو</Typography>
            </Link>
          </Box>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List className={styles.drawerList}>
          <ListItem disablePadding className={styles.drawerItem}>
            <ListItemButton onClick={handleMobileSolutionsToggle}>
              <ListItemText
                primary="راه حل ها"
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
                  <ListItemButton>
                    <ListItemText primary={item} />
                  </ListItemButton>
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
            <ListItemButton onClick={handleMobileResourcesToggle}>
              <ListItemText primary="منابع" className={styles.drawerItemText} />
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
                  <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    <ListItemButton onClick={handleDrawerToggle}>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Collapse>

          <ListItem disablePadding className={styles.drawerItem}>
            <Link href="/about" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }} onClick={handleDrawerToggle}>
              <ListItemButton>
                <ListItemText
                  primary="درباره ما"
                  className={styles.drawerItemText}
                />
              </ListItemButton>
            </Link>
          </ListItem>

          <ListItem disablePadding className={styles.drawerItem}>
            <ListItemButton>
              <ListItemText
                primary="تماس با ما"
                className={styles.drawerItemText}
              />
            </ListItemButton>
          </ListItem>

          <Box className={styles.drawerButtons}>
            <Button className={styles.loginButton} fullWidth onClick={login}>
              ورود
            </Button>
            <Button className={styles.startButton} fullWidth onClick={login}>
              شروع کنید
            </Button>
          </Box>
        </List>
      </Drawer>
    </Box>
  )
}
