import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Toaster } from "sonner"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
        <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="text-xs">
              Advertising Analytics Platform - Connect your Google & Facebook Ads
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-[#4285F4]"></span>
              <span className="h-2 w-2 rounded-full bg-[#EA4335]"></span>
              <span className="h-2 w-2 rounded-full bg-[#FBBC05]"></span>
              <span className="h-2 w-2 rounded-full bg-[#34A853]"></span>
              <span className="h-2 w-2 rounded-full bg-[#1877F2] ml-1"></span>
            </div>
          </div>
        </footer>
      </div>
      <Toaster position="top-right" />
    </div>
  )
} 