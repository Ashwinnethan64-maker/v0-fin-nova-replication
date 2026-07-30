import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { isDemoMode, MOCK_USER } from "@/lib/demo"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user: any = MOCK_USER

  if (!isDemoMode()) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      redirect("/auth/login")
    }
    user = data.user
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardNav user={user} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
