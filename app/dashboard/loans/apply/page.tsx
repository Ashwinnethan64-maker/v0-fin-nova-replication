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

export default function ApplyLoanPage() {
  const [principalAmount, setPrincipalAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [tenure, setTenure] = useState("")
  const [purpose, setPurpose] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAssessing, setIsAssessing] = useState(false)
  const router = useRouter()

  // Calculate EMI
  const calculateEMI = (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / 12 / 100
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return emi
  }

  const monthlyEMI =
    principalAmount && interestRate && tenure
      ? calculateEMI(Number.parseFloat(principalAmount), Number.parseFloat(interestRate), Number.parseInt(tenure))
      : 0

  // Simulate AI-driven risk assessment
  const handleAssessRisk = async () => {
    if (!principalAmount || !interestRate || !tenure) {
      setError("Please fill in all required fields")
      return
    }

    setIsAssessing(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple risk scoring algorithm (0-1000)
    const principal = Number.parseFloat(principalAmount)
    const rate = Number.parseFloat(interestRate)
    const months = Number.parseInt(tenure)

    // Base score
    let score = 750

    // Adjust based on loan amount (higher = higher risk)
    if (principal > 50000) score -= 100
    if (principal > 100000) score -= 100

    // Adjust based on interest rate (higher = higher risk acceptance)
    if (rate > 15) score -= 50

    // Adjust based on tenure (longer = higher risk)
    if (months > 60) score -= 50

    // Adjust based on EMI vs typical income (mock)
    const emi = calculateEMI(principal, rate, months)
    if (emi > 5000) score -= 75

    // Simulate credit history impact
    score += Math.random() * 50 - 25

    setRiskScore(Math.max(300, Math.min(score, 900)))
    setIsAssessing(false)
  }

  const handleApplyLoan = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error("Not authenticated")

      const emiAmount = calculateEMI(
        Number.parseFloat(principalAmount),
        Number.parseFloat(interestRate),
        Number.parseInt(tenure),
      )

      const { error: insertError } = await supabase.from("loans").insert({
        user_id: user.user.id,
        principal_amount: Number.parseFloat(principalAmount),
        interest_rate: Number.parseFloat(interestRate),
        tenure_months: Number.parseInt(tenure),
        emi_amount: emiAmount,
        status: "applied",
        risk_score: riskScore,
        purpose,
      })

      if (insertError) throw insertError
      router.push("/dashboard/loans")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-border px-8 py-6">
        <h1 className="text-3xl font-bold">Apply for Loan 💰</h1>
        <p className="text-muted-foreground mt-1">Get instant AI-driven risk assessment</p>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Loan Application</CardTitle>
                <CardDescription>Fill in your loan details and get an instant assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApplyLoan} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="principalAmount">Loan Amount ($) *</Label>
                      <Input
                        id="principalAmount"
                        type="number"
                        placeholder="10000"
                        step="100"
                        value={principalAmount}
                        onChange={(e) => setPrincipalAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest Rate (%) *</Label>
                      <Input
                        id="interestRate"
                        type="number"
                        placeholder="12.5"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tenure">Tenure (Months) *</Label>
                      <Select value={tenure} onValueChange={setTenure}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                          <SelectItem value="36">36 months</SelectItem>
                          <SelectItem value="48">48 months</SelectItem>
                          <SelectItem value="60">60 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose</Label>
                      <Input
                        id="purpose"
                        placeholder="e.g., Business Expansion"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAssessRisk}
                      disabled={isAssessing || !principalAmount || !interestRate || !tenure}
                    >
                      {isAssessing ? "Assessing..." : "Get Risk Assessment"}
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={isLoading || !riskScore}
                    >
                      {isLoading ? "Applying..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">EMI Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-xs text-muted-foreground">Principal Amount</p>
                    <p className="text-2xl font-bold">
                      ${principalAmount ? Number.parseFloat(principalAmount).toFixed(2) : "0.00"}
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-xs text-muted-foreground">Monthly EMI</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${monthlyEMI.toFixed(2)}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-xs text-muted-foreground">Total Payable</p>
                    <p className="text-2xl font-bold">
                      ${(monthlyEMI * (tenure ? Number.parseInt(tenure) : 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {riskScore && (
              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Credit Score</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{riskScore}</p>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                        style={{ width: `${(riskScore / 900) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {riskScore >= 750
                        ? "Excellent - Likely to be approved with favorable terms"
                        : riskScore >= 650
                          ? "Good - Likely to be approved with standard terms"
                          : "Fair - May require additional documentation"}
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-400">
                    Assessment is based on AI-driven analysis of your loan parameters. Final approval is subject to
                    additional verification.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
