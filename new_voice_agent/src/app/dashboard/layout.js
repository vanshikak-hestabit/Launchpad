import DashboardNavbar from "@/components/navbar"

export const metadata = {
  title: "Dashboard - Dashly",
  description: "Your personal dashboard overview",
}

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <DashboardNavbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
