import DashboardNavbar from "@/components/navbar"

export const metadata = {
  title: "Echo",
  description: "Your personal voice agent",
}

export default function DashboardLayout({ children }) { //children means the page that will be shown that is the dashboard/page.js
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <DashboardNavbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
