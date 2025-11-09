"use client"

import type { Tables } from "@/lib/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface CategoryBreakdownProps {
  transactions: Tables<"transactions">[]
}

const COLORS = [
  "hsl(0, 84.2%, 60.2%)",
  "hsl(38.6, 92.1%, 50.2%)",
  "hsl(142.1, 76.2%, 36.3%)",
  "hsl(217.2, 91.2%, 59.8%)",
  "hsl(280.9, 80.4%, 54.3%)",
  "hsl(262.1, 80%, 50.4%)",
]

export function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  // Group expenses by category
  const categoryData = transactions
    .filter((t) => t.transaction_type === "expense")
    .reduce(
      (acc, transaction) => {
        const category = transaction.category || "Other"
        const existing = acc.find((item) => item.name === category)

        if (existing) {
          existing.value += transaction.amount
        } else {
          acc.push({ name: category, value: transaction.amount })
        }

        return acc
      },
      [] as { name: string; value: number }[],
    )
    .sort((a, b) => b.value - a.value)

  const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.value, 0)

  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8 text-sm">No expense data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Expense by Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${(value as number).toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-2 mt-4">
          {categoryData.map((category, index) => (
            <div key={category.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
                <span className="text-muted-foreground">{category.name}</span>
              </div>
              <span className="font-medium">{((category.value / totalExpenses) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
