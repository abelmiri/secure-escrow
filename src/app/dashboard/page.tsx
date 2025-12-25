import Dashboard from "@/components/Dashboard/Dashboard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "داشبورد | امان یار",
  description: "نمای کلی معاملات شما در امان یار",
}

export default function DashboardPage() {
  return <Dashboard />
}
