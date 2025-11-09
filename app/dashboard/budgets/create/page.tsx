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

const BUDGET_CATEGORIES = [
  "Food",
  "Utilities",
  "Entertainment",
  "Transport",
  "Shopping",
  "Health",
  "Business",
  "Loans",
  "Other",
]

export default function CreateBudgetPage() {
  const [category, setCategory] = useState("Food")
  const [monthlyLimit, setMonthlyLimit] = useState("")
  const [warningThreshold, setWarningThreshold] = useState("80")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error("Not authenticated")

      const { error: insertError } = await supabase.from("budgets").insert({
        user_id: user.user.id,
        category: category.toLowerCase(),
        monthly_limit: Number.parseFloat(monthlyLimit),
        warning_threshold: Number.parseFloat(warningThreshold),
        spent_this_month: 0,
        is_active: true,
      })

      if (insertError) throw insertError
      router.push("/dashboard/budgets")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-border px-8 py-6">
        <h1 className="text-3xl font-bold">Create Budget 📋</h1>
        <p className="text-muted-foreground mt-1">Set spending limits for a category</p>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Budget Details</CardTitle>
              <CardDescription>Set a monthly spending limit for a category</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBudget} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyLimit">Monthly Limit ($)</Label>
                    <Input
                      id="monthlyLimit"
                      type="number"
                      placeholder="500.00"
                      step="0.01"
                      value={monthlyLimit}
                      onChange={(e) => setMonthlyLimit(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warningThreshold">Warning Threshold (%)</Label>
                  <Select value={warningThreshold} onValueChange={setWarningThreshold}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50% - Conservative</SelectItem>
                      <SelectItem value="70">70% - Moderate</SelectItem>
                      <SelectItem value="80">80% - Standard</SelectItem>
                      <SelectItem value="90">90% - Relaxed</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    You'll receive an alert when spending reaches this percentage
                  </p>
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
                    {isLoading ? "Creating..." : "Create Budget"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
