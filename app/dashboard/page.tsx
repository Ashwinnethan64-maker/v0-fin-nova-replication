import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AccountSummary } from "@/components/dashboard/account-summary"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { BudgetOverview } from "@/components/dashboard/budget-overview"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { isDemoMode, MOCK_PROFILE, MOCK_ACCOUNTS, MOCK_TRANSACTIONS, MOCK_LOANS, MOCK_BUDGETS } from "@/lib/demo"

export default async function DashboardPage() {
  let profile: any = MOCK_PROFILE
  let accounts: any[] = MOCK_ACCOUNTS
  let transactions: any[] = MOCK_TRANSACTIONS
  let loans: any[] = MOCK_LOANS
  let budgets: any[] = MOCK_BUDGETS

  if (!isDemoMode()) {
    const supabase = await createClient()
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user.user) {
      redirect("/auth/login")
    }

    const { data: p } = await supabase.from("profiles").select("*").eq("id", user.user.id).single()
    if (p) profile = p

    const { data: acc } = await supabase.from("accounts").select("*").eq("user_id", user.user.id)
    if (acc) accounts = acc

    const { data: tx } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.user.id)
      .order("transaction_date", { ascending: false })
      .limit(5)
    if (tx) transactions = tx

    const { data: ln } = await supabase.from("loans").select("*").eq("user_id", user.user.id).eq("status", "active")
    if (ln) loans = ln

    const { data: bg } = await supabase.from("budgets").select("*").eq("user_id", user.user.id).eq("is_active", true)
    if (bg) budgets = bg
  }

  const totalBalance = (accounts || []).reduce((sum, acc) => sum + (acc.balance || 0), 0)
  const totalLoansAmount = (loans || []).reduce((sum, loan) => sum + (loan.principal_amount || 0), 0)
  const dueSoonCount = (loans || []).length

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader profile={profile} />

      <div className="flex-1 p-8 space-y-8 overflow-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Balance" value={`$${totalBalance.toFixed(2)}`} icon="💰" trend="+2.5%" />
          <StatCard
            title="Active Loans"
            value={dueSoonCount.toString()}
            icon="📊"
            subtext={`$${totalLoansAmount.toFixed(2)} total`}
          />
          <StatCard
            title="Monthly Spent"
            value={`$${((transactions || []).filter((t) => t.transaction_type === "expense").reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}`}
            icon="💳"
            trend="+5.2%"
          />
          <StatCard title="Budget Status" value={`${(budgets || []).length} active`} icon="📋" subtext="Budgets set" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <QuickActions />
            <RecentTransactions transactions={transactions || []} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <AccountSummary accounts={accounts || []} />
            <BudgetOverview budgets={budgets || []} />
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: string
  trend?: string
  subtext?: string
}

function StatCard({ title, value, icon, trend, subtext }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {trend && <p className="text-xs text-green-600 dark:text-green-400">↑ {trend}</p>}
      {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
    </div>
  )
}
