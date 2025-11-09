"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TransferPage() {
  const [fromAccount, setFromAccount] = useState("")
  const [toRecipient, setToRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [transferType, setTransferType] = useState("internal")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Mock accounts for from selection
  const mockAccounts = [
    { id: "acc1", name: "Checking Account", balance: 5000 },
    { id: "acc2", name: "Savings Account", balance: 12000 },
  ]

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error("Not authenticated")

      // Create transaction record
      const { error: insertError } = await supabase.from("transactions").insert({
        user_id: user.user.id,
        amount: Number.parseFloat(amount),
        transaction_type: "transfer",
        description: description || `Transfer to ${toRecipient}`,
        status: "completed",
        merchant_name: toRecipient,
      })

      if (insertError) throw insertError
      setSuccess(true)
      setTimeout(() => router.push("/dashboard/transactions"), 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-border px-8 py-6">
        <h1 className="text-3xl font-bold">Transfer Money 🔄</h1>
        <p className="text-muted-foreground mt-1">Send money to another account</p>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transfer Details</CardTitle>
                <CardDescription>Complete the transfer in a few simple steps</CardDescription>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center space-y-4">
                    <div className="text-5xl">✓</div>
                    <p className="text-lg font-semibold text-green-700 dark:text-green-400">Transfer Successful!</p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ${amount} has been transferred to {toRecipient}
                    </p>
                    <p className="text-xs text-muted-foreground">Redirecting to transactions...</p>
                  </div>
                ) : (
                  <form onSubmit={handleTransfer} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="transferType">Transfer Type</Label>
                      <Select value={transferType} onValueChange={setTransferType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Between My Accounts</SelectItem>
                          <SelectItem value="external">To Another Person</SelectItem>
                          <SelectItem value="upi">UPI Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {transferType === "internal" ? (
                      <div className="space-y-2">
                        <Label htmlFor="fromAccount">From Account</Label>
                        <Select value={fromAccount} onValueChange={setFromAccount}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockAccounts.map((acc) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.name} (${acc.balance})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <Label htmlFor="toRecipient">Recipient {transferType === "upi" ? "UPI ID" : "Account"}</Label>
                      <Input
                        id="toRecipient"
                        placeholder={transferType === "upi" ? "user@bank" : "Account holder name"}
                        value={toRecipient}
                        onChange={(e) => setToRecipient(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="1000.00"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        placeholder="e.g., Rent payment"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Confirm Transfer"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transfer Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                    <p className="text-xs text-muted-foreground">Transfer Amount</p>
                    <p className="text-2xl font-bold">${amount ? Number.parseFloat(amount).toFixed(2) : "0.00"}</p>
                  </div>

                  {fromAccount && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-medium">{mockAccounts.find((a) => a.id === fromAccount)?.name}</p>
                    </div>
                  )}

                  {toRecipient && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                      <p className="text-xs text-muted-foreground">To</p>
                      <p className="font-medium">{toRecipient}</p>
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-400 space-y-2">
                    <p className="font-semibold">Fees</p>
                    <p>No transfer fee for this transaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
