import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BudgetsList } from "@/components/dashboard/budgets-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function BudgetsPage() {
  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) {
    redirect("/auth/login")
  }

  const { data: budgets } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user.user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Budgets 📋</h1>
            <p className="text-muted-foreground mt-1">Track and manage your spending limits</p>
          </div>
          <Link href="/dashboard/budgets/create">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              + Create Budget
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <BudgetsList budgets={budgets || []} />
      </div>
    </div>
  )
}
