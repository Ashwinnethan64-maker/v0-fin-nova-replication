"use client"

import type { Tables } from "@/lib/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AccountsListProps {
  accounts: Tables<"accounts">[]
}

export function AccountsList({ accounts: initialAccounts }: AccountsListProps) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return

    const supabase = createClient()
    const { error } = await supabase.from("accounts").delete().eq("id", id)

    if (!error) {
      setAccounts(accounts.filter((a) => a.id !== id))
    }
  }

  const handleSetPrimary = async (id: string) => {
    const supabase = createClient()

    // Unset all primary accounts first
    await supabase.from("accounts").update({ is_primary: false }).eq("is_primary", true)

    // Set the selected one as primary
    const { error } = await supabase.from("accounts").update({ is_primary: true }).eq("id", id)

    if (!error) {
      setAccounts(
        accounts.map((a) => ({
          ...a,
          is_primary: a.id === id,
        })),
      )
    }
  }

  const getAccountIcon = (type: string | null) => {
    switch (type) {
      case "bank":
        return "🏦"
      case "card":
        return "💳"
      case "digital_wallet":
        return "📱"
      default:
        return "💰"
    }
  }

  return (
    <div className="space-y-6">
      {accounts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-lg text-muted-foreground mb-4">No accounts linked yet</p>
            <Button asChild variant="outline">
              <a href="/dashboard/accounts/add">Add Your First Account</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card
              key={account.id}
              className={`relative overflow-hidden ${
                account.is_primary ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
              }`}
            >
              {account.is_primary && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-semibold rounded-bl">
                  Primary
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getAccountIcon(account.account_type)}</span>
                    <div>
                      <CardTitle className="text-lg">{account.account_name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {account.account_type === "card" ? "Card" : "Account"} • {account.bank_name}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        ⋯
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!account.is_primary && (
                        <DropdownMenuItem onClick={() => handleSetPrimary(account.id || "")}>
                          Set as Primary
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDelete(account.id || "")}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6 font-mono space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-sm opacity-75">CARD NUMBER</span>
                    <span className="text-xs font-semibold">{account.account_type === "card" ? "VISA" : "BANK"}</span>
                  </div>
                  <div className="text-xl tracking-wider">•••• •••• •••• {account.last_four}</div>
                  <div className="flex justify-between pt-4 border-t border-white/20 text-xs">
                    <div>
                      <div className="opacity-75">Balance</div>
                      <div className="font-semibold text-lg">${(account.balance || 0).toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="opacity-75">Currency</div>
                      <div className="font-semibold">{account.currency}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Verification Status</span>
                    <span className="font-medium">
                      {account.is_verified ? (
                        <span className="text-green-600 dark:text-green-400">✓ Verified</span>
                      ) : (
                        <span className="text-yellow-600 dark:text-yellow-400">⊘ Unverified</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account Type</span>
                    <span className="font-medium capitalize">{account.account_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Added</span>
                    <span className="font-medium text-xs">
                      {new Date(account.created_at || "").toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
