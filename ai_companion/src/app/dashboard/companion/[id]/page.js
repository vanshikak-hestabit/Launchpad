"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import DashboardNavbar from "@/components/dashboardNav"
import CompanionForm from "@/components/CompanionForm"
import { supabase } from "@/lib/supabase/client"

export default function EditCompanionPage() {
  const router = useRouter()
  const params = useParams()
  const [companion, setCompanion] = useState(null)

  useEffect(() => {
    const fetchCompanion = async () => {
      const { data, error } = await supabase
        .from("companions")
        .select("*")
        .eq("id", params.id)
        .single()

      if (error) {
        console.error(error)
        return
      }
      setCompanion(data)
    }

    fetchCompanion()
  }, [params.id])

  return (
    <div>
      <DashboardNavbar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Edit Companion</h1>
        {companion && (
          <CompanionForm companion={companion} onSuccess={() => router.push("/dashboard")} />
        )}
      </div>
    </div>
  )
}