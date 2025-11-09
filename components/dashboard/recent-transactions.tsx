"use client"

import type { Tables } from "@/lib/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface RecentTransactionsProps {
  transactions: Tables<"transactions">[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "income":
        return "📈"
      case "expense":
        return "💸"
      case "transfer":
        return "🔄"
      case "loan_payment":
        return "💳"
      default:
        return "💰"
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-green-600 dark:text-green-400"
      case "expense":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-slate-600 dark:text-slate-400"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <Link href="/dashboard/transactions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getTransactionIcon(transaction.transaction_type || "")}</span>
                  <div>
                    <p className="font-medium text-sm">{transaction.merchant_name || transaction.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.transaction_date || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold text-sm ${getTransactionColor(transaction.transaction_type || "")}`}>
                  {transaction.transaction_type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
