"use client"

import type { Tables } from "@/lib/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface BudgetsListProps {
  budgets: Tables<"budgets">[]
}

export function BudgetsList({ budgets: initialBudgets }: BudgetsListProps) {
  const [budgets, setBudgets] = useState(initialBudgets)

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this budget?")) return

    const supabase = createClient()
    const { error } = await supabase.from("budgets").update({ is_active: false }).eq("id", id)

    if (!error) {
      setBudgets(budgets.filter((b) => b.id !== id))
    }
  }

  const getBudgetColor = (percentage: number) => {
    if (percentage >= 90) return { bar: "bg-red-500", text: "text-red-600" }
    if (percentage >= 70) return { bar: "bg-yellow-500", text: "text-yellow-600" }
    return { bar: "bg-green-500", text: "text-green-600" }
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      food: "🍔",
      utilities: "💡",
      entertainment: "🎬",
      transport: "🚗",
      shopping: "🛍️",
      health: "⚕️",
      business: "💼",
      loans: "💰",
      other: "📦",
    }
    return emojis[category.toLowerCase()] || "📊"
  }

  return (
    <div className="space-y-6">
      {budgets.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-lg text-muted-foreground mb-4">No budgets created yet</p>
            <Button asChild variant="outline">
              <a href="/dashboard/budgets/create">Create Your First Budget</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const percentage = ((budget.spent_this_month || 0) / (budget.monthly_limit || 1)) * 100
            const colors = getBudgetColor(percentage)
            const remaining = (budget.monthly_limit || 0) - (budget.spent_this_month || 0)

            return (
              <Card key={budget.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getCategoryEmoji(budget.category || "")}</span>
                      <div>
                        <CardTitle className="text-lg capitalize">{budget.category}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">Monthly Budget</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          ⋯
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(budget.id || "")}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-semibold">
                        ${(budget.spent_this_month || 0).toFixed(2)} / ${(budget.monthly_limit || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors.bar} rounded-full transition-all`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Spent</p>
                      <p className="font-semibold text-red-600 dark:text-red-400">
                        ${(budget.spent_this_month || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                      <p
                        className={`font-semibold ${remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        ${remaining.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <div className={`h-2 flex-1 rounded-full ${colors.bar}`} />
                    <p className={`text-xs font-semibold ${colors.text}`}>{percentage.toFixed(0)}%</p>
                  </div>

                  {percentage >= 90 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded text-xs">
                      ⚠️ You&apos;ve reached 90% of this budget!
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
