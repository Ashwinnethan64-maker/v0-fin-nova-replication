import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { IncomeVsExpenses } from "@/components/dashboard/income-vs-expenses"
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown"
import { TopMerchants } from "@/components/dashboard/top-merchants"
import { isDemoMode, MOCK_TRANSACTIONS } from "@/lib/demo"

export default async function AnalyticsPage() {
  let transactions: any[] = MOCK_TRANSACTIONS

  if (!isDemoMode()) {
    const supabase = await createClient()

    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user.user) {
      redirect("/auth/login")
    }

    const { data: tx } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.user.id)
      .order("transaction_date", { ascending: false })
      .limit(500)
    if (tx) transactions = tx
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-border px-8 py-6">
        <h1 className="text-3xl font-bold">Analytics & Insights 📈</h1>
        <p className="text-muted-foreground mt-1">Understand your financial patterns</p>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="space-y-8">
          {/* Income vs Expenses */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <IncomeVsExpenses transactions={transactions || []} />
            </div>
            <div>
              <CategoryBreakdown transactions={transactions || []} />
            </div>
          </div>

          {/* Spending Trends */}
          <SpendingChart transactions={transactions || []} />

          {/* Top Merchants */}
          <TopMerchants transactions={transactions || []} />
        </div>
      </div>
    </div>
  )
}
