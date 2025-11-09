"use client"

import type { Tables } from "@/lib/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LoansListProps {
  loans: Tables<"loans">[]
}

export function LoansList({ loans }: LoansListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return { badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", icon: "📋" }
      case "approved":
        return { badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", icon: "✓" }
      case "rejected":
        return { badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400", icon: "✗" }
      case "active":
        return { badge: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400", icon: "💳" }
      case "completed":
        return { badge: "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400", icon: "✓" }
      case "defaulted":
        return { badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400", icon: "⚠️" }
      default:
        return { badge: "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400", icon: "📊" }
    }
  }

  const getRiskColor = (score: number | null) => {
    if (!score) return "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400"
    if (score >= 750) return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
    if (score >= 650) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
    return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
  }

  const totalLoans = loans.length
  const activeLoan = loans.filter((l) => l.status === "active")
  const totalBorrowed = loans.reduce((sum, l) => sum + (l.principal_amount || 0), 0)
  const totalEMI = activeLoan.reduce((sum, l) => sum + (l.emi_amount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Loans</p>
              <p className="text-2xl font-bold">{totalLoans}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Active Loans</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeLoan.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Borrowed</p>
              <p className="text-2xl font-bold">${totalBorrowed.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Monthly EMI</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${totalEMI.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loans List */}
      {loans.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-lg text-muted-foreground mb-4">No loans yet</p>
            <a href="/dashboard/loans/apply" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Apply for a loan
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {loans.map((loan) => {
            const statusColor = getStatusColor(loan.status || "")
            const riskColor = getRiskColor(loan.risk_score)
            const monthlyPayment = loan.emi_amount || 0

            return (
              <Card key={loan.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle>{loan.principal_amount && `$${loan.principal_amount.toFixed(2)}`}</CardTitle>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor.badge}`}>
                          {statusColor.icon} {loan.status?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Purpose: {loan.purpose || "Not specified"}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                      <p className="font-semibold">{loan.interest_rate?.toFixed(2)}%</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Tenure</p>
                      <p className="font-semibold">{loan.tenure_months} months</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Monthly EMI</p>
                      <p className="font-semibold">${monthlyPayment.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Loan Status</p>
                      <div className="space-y-2">
                        {loan.disbursed_at && (
                          <p className="text-xs">Disbursed: {new Date(loan.disbursed_at).toLocaleDateString()}</p>
                        )}
                        <p className="text-xs">Applied: {new Date(loan.created_at || "").toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Risk Assessment</p>
                      {loan.risk_score ? (
                        <div className={`px-3 py-2 rounded-lg text-center font-semibold text-sm ${riskColor}`}>
                          Score: {loan.risk_score}
                        </div>
                      ) : (
                        <div className="px-3 py-2 rounded-lg text-center text-xs text-muted-foreground">
                          Pending assessment
                        </div>
                      )}
                    </div>
                  </div>

                  {loan.status === "active" && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-lg text-sm space-y-1">
                      <p className="font-semibold">Next Payment Due</p>
                      <p className="text-xs">Calculate from EMI schedule</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
