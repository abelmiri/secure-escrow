import AuthGuard from "@/components/Auth/AuthGuard"
import PartnerProfile from "@/components/PartnerProfile/PartnerProfile"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "پروفایل کارگزاری | امان یار",
  description: "مشاهده اطلاعات و وضعیت پروفایل کارگزاری در امان یار",
}

export default async function PartnerProfilePage({
  params,
}: {
  params: Promise<{ brokerId: string }>
}) {
  const brokerId = (await params).brokerId

  return (
    <AuthGuard>
      <PartnerProfile brokerId={brokerId} />
    </AuthGuard>
  )
}
