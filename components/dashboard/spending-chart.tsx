"use client"

import type { Tables } from "@/lib/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SpendingChartProps {
  transactions: Tables<"transactions">[]
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  // Group by week
  const weeklyData = transactions
    .filter((t) => t.transaction_type === "expense")
    .reduce(
      (acc, transaction) => {
        const date = new Date(transaction.transaction_date || "")
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        const weekKey = weekStart.toISOString().split("T")[0]

        if (!acc[weekKey]) {
          acc[weekKey] = { week: weekKey, amount: 0 }
        }

        acc[weekKey].amount += transaction.amount

        return acc
      },
      {} as Record<string, { week: string; amount: number }>,
    )

  const data = Object.values(weeklyData)
    .sort((a, b) => a.week.localeCompare(b.week))
    .map((item) => ({
      ...item,
      week: new Date(item.week).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }))

  const avgSpending = data.length > 0 ? data.reduce((sum, w) => sum + w.amount, 0) / data.length : 0

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No spending data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Weekly Spending Trend</CardTitle>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Average Weekly Spend</p>
            <p className="text-2xl font-bold">${avgSpending.toFixed(2)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value) => `$${(value as number).toFixed(2)}`} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(217.2, 91.2%, 59.8%)"
              strokeWidth={2}
              dot={{ fill: "hsl(217.2, 91.2%, 59.8%)", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
