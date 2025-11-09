"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    { label: "Transfer Money", icon: "🔄", href: "/dashboard/transactions/transfer" },
    { label: "Apply for Loan", icon: "💰", href: "/dashboard/loans/apply" },
    { label: "Add Account", icon: "🏦", href: "/dashboard/accounts/add" },
    { label: "Set Budget", icon: "📋", href: "/dashboard/budgets/create" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 bg-transparent"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm font-medium text-center">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
