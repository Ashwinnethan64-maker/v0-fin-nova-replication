"use client"

import type { Tables } from "@/lib/database.types"

interface DashboardHeaderProps {
  profile: Tables<"profiles"> | null
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const greeting = getGreeting()

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-border px-8 py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {greeting}, {profile?.first_name || "User"}! 👋
        </h1>
        <p className="text-muted-foreground">Here's your financial overview for today</p>
      </div>
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}
