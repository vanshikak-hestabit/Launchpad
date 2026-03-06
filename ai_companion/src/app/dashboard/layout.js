import Sidebar from "@/components/Sidebar";
import DashboardNavbar from "@/components/dashboardNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">

      {/* Navbar on top */}
      <DashboardNavbar />

      {/* Sidebar + Page */}
      <div className="flex flex-1">

        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>

      </div>

    </div>
  );
}