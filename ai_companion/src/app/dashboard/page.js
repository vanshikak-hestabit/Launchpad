import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"
import DashboardNavbar from "@/components/dashboardNav"

export default async function Dashboard() {
  const supabase = await createSupabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect("/login")

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="p-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </main>
    </div>
  )
}