"use client"

import type { Tables } from "@/lib/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface IncomeVsExpensesProps {
  transactions: Tables<"transactions">[]
}

export function IncomeVsExpenses({ transactions }: IncomeVsExpensesProps) {
  // Group transactions by month
  const monthlyData = transactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.transaction_date || "")
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, income: 0, expenses: 0 }
      }

      if (transaction.transaction_type === "income") {
        acc[monthKey].income += transaction.amount
      } else if (transaction.transaction_type === "expense") {
        acc[monthKey].expenses += transaction.amount
      }

      return acc
    },
    {} as Record<string, { month: string; income: number; expenses: number }>,
  )

  const data = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No transaction data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses (Monthly)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${(value as number).toFixed(2)}`} />
            <Legend />
            <Bar dataKey="income" fill="hsl(142.1, 76.2%, 36.3%)" name="Income" />
            <Bar dataKey="expenses" fill="hsl(0, 84.2%, 60.2%)" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
