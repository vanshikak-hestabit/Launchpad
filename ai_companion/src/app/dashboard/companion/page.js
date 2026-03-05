"use client"
import DashboardNavbar from "@/components/dashboardNav"
import CompanionForm from "@/components/CompanionForm"

export default function CreateCompanionPage() {
  return (
    <div>
      <DashboardNavbar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Create Companion</h1>
        <CompanionForm />
      </div>
    </div>
  )
}