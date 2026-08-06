import AuthGuard from "@/components/Auth/AuthGuard"
import ProfileSelection from "@/components/ProfileSelection/ProfileSelection"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "انتخاب پروفایل | امان یار",
  description: "انتخاب پروفایل شخصی یا نمایندگی کسب‌وکار در امان یار",
}

export default function ProfileSelectPage() {
  return (
    <AuthGuard skipProfileSelection>
      <ProfileSelection />
    </AuthGuard>
  )
}
