import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LoansList } from "@/components/dashboard/loans-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { isDemoMode, MOCK_LOANS } from "@/lib/demo"

export default async function LoansPage() {
  let loans: any[] = MOCK_LOANS

  if (!isDemoMode()) {
    const supabase = await createClient()

    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user.user) {
      redirect("/auth/login")
    }

    const { data: ln } = await supabase
      .from("loans")
      .select("*")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false })
    if (ln) loans = ln
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Loans 💰</h1>
            <p className="text-muted-foreground mt-1">Manage your loans and credit</p>
          </div>
          <Link href="/dashboard/loans/apply">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              + Apply for Loan
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <LoansList loans={loans || []} />
      </div>
    </div>
  )
}
