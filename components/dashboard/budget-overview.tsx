"use client"

import type { Tables } from "@/lib/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BudgetOverviewProps {
  budgets: Tables<"budgets">[]
}

export function BudgetOverview({ budgets }: BudgetOverviewProps) {
  const getBudgetColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Budget Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No budgets set yet</p>
        ) : (
          budgets.map((budget) => {
            const percentage = ((budget.spent_this_month || 0) / (budget.monthly_limit || 1)) * 100
            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{budget.category}</p>
                  <p className="text-xs text-muted-foreground">
                    ${budget.spent_this_month?.toFixed(2)} / ${budget.monthly_limit?.toFixed(2)}
                  </p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getBudgetColor(percentage)} rounded-full transition-all`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}% spent</p>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
