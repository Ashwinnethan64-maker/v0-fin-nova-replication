import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AccountsList } from "@/components/dashboard/accounts-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { isDemoMode, MOCK_ACCOUNTS } from "@/lib/demo"

export default async function AccountsPage() {
  let accounts: any[] = MOCK_ACCOUNTS

  if (!isDemoMode()) {
    const supabase = await createClient()

    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user.user) {
      redirect("/auth/login")
    }

    const { data: acc } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false })
    if (acc) accounts = acc
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Accounts & Cards 🏦</h1>
            <p className="text-muted-foreground mt-1">Manage your linked accounts</p>
          </div>
          <Link href="/dashboard/accounts/add">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              + Add Account
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <AccountsList accounts={accounts || []} />
      </div>
    </div>
  )
}
