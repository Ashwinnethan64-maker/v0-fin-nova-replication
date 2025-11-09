import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TransactionsList } from "@/components/dashboard/transactions-list"

export default async function TransactionsPage() {
  const supabase = await createClient()

  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user.user) {
    redirect("/auth/login")
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.user.id)
    .order("transaction_date", { ascending: false })

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-border px-8 py-6">
        <h1 className="text-3xl font-bold">Transactions 💳</h1>
        <p className="text-muted-foreground mt-1">View and manage all your transactions</p>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <TransactionsList transactions={transactions || []} />
      </div>
    </div>
  )
}
