import { redirect } from "next/navigation"
import { createSupabaseServer } from "@/lib/supabase/server"

export default async function Dashboard() {
  const supabase = await createSupabaseServer()

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect("/login")

  return <h1>Dashboard</h1>
}