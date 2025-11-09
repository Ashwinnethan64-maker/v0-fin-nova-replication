"use client"

import type { Tables } from "@/lib/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AccountSummaryProps {
  accounts: Tables<"accounts">[]
}

export function AccountSummary({ accounts }: AccountSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No accounts linked yet</p>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1">
                <p className="font-medium">{account.account_name}</p>
                <p className="text-xs text-muted-foreground">
                  {account.bank_name} •••• {account.last_four}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${account.balance?.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{account.is_verified ? "✓ Verified" : "Unverified"}</p>
              </div>
            </div>
          ))
        )}
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          + Add Account
        </Button>
      </CardContent>
    </Card>
  )
}
