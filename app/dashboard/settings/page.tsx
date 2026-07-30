import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { isDemoMode, MOCK_USER, MOCK_PROFILE } from "@/lib/demo"

export default async function SettingsPage() {
  let user: any = { user: MOCK_USER }
  let profile: any = MOCK_PROFILE

  if (!isDemoMode()) {
    const supabase = await createClient()

    const { data: u, error: userError } = await supabase.auth.getUser()
    if (userError || !u.user) {
      redirect("/auth/login")
    }
    user = u

    const { data: p } = await supabase.from("profiles").select("*").eq("id", user.user.id).single()
    if (p) profile = p
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-border px-8 py-6">
        <h1 className="text-3xl font-bold">Settings ⚙️</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{profile?.first_name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="font-medium capitalize">{profile?.user_type || "personal"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">KYC Status</p>
                <p className="font-medium capitalize">{profile?.kyc_status || "pending"}</p>
              </div>
              <Link href="/dashboard/settings/profile">
                <Button variant="outline" className="mt-4 bg-transparent">
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enhance your account security with 2FA and strong passwords
              </p>
              <Button variant="outline">Change Password</Button>
              <Button variant="outline" className="ml-2 bg-transparent">
                Enable 2FA
              </Button>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Language</p>
                <p className="text-sm text-muted-foreground">English</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Currency</p>
                <p className="text-sm text-muted-foreground">USD ($)</p>
              </div>
              <Button variant="outline" className="mt-4 bg-transparent">
                Manage Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
