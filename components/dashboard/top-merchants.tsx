"use client"

import type { Tables } from "@/lib/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TopMerchantsProps {
  transactions: Tables<"transactions">[]
}

export function TopMerchants({ transactions }: TopMerchantsProps) {
  // Calculate top merchants by total spending
  const merchantData = transactions
    .filter((t) => t.merchant_name && t.transaction_type === "expense")
    .reduce(
      (acc, transaction) => {
        const merchant = transaction.merchant_name || "Unknown"
        const existing = acc.find((item) => item.name === merchant)

        if (existing) {
          existing.count += 1
          existing.amount += transaction.amount
        } else {
          acc.push({ name: merchant, count: 1, amount: transaction.amount })
        }

        return acc
      },
      [] as { name: string; count: number; amount: number }[],
    )
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)

  if (merchantData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Merchants</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No merchant data available</p>
        </CardContent>
      </Card>
    )
  }

  const totalSpent = merchantData.reduce((sum, m) => sum + m.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Merchants by Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {merchantData.map((merchant, index) => (
            <div key={merchant.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground w-6">#{index + 1}</span>
                  <div>
                    <p className="font-medium">{merchant.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {merchant.count} transaction{merchant.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">${merchant.amount.toFixed(2)}</p>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{
                    width: `${(merchant.amount / totalSpent) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
