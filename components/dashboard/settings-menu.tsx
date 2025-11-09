"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SettingsMenu() {
  return (
    <div className="space-y-2">
      <Link href="/dashboard/settings/profile">
        <Button variant="ghost" className="w-full justify-start">
          Profile Settings
        </Button>
      </Link>
      <Link href="/dashboard/settings/security">
        <Button variant="ghost" className="w-full justify-start">
          Security
        </Button>
      </Link>
      <Link href="/dashboard/settings/notifications">
        <Button variant="ghost" className="w-full justify-start">
          Notifications
        </Button>
      </Link>
    </div>
  )
}
