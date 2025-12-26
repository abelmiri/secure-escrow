import Profile from "@/components/Profile/Profile"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "پروفایل | امان یار",
  description: "مدیریت تنظیمات حساب کاربری در امان یار",
}

export default function ProfilePage() {
  return <Profile />
}
