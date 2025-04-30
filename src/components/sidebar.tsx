"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  ChevronLeft, 
  LayoutDashboard, 
  Settings, 
  Layers, 
  BarChart3,
  Users,
  FileText,
  Bell,
  Home,
  DollarSign,
  BarChart,
  Share2,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen border-r transition-all duration-300 ease-in-out bg-white dark:bg-gray-900",
        collapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      <div className="p-4 h-16 flex items-center border-b">
        {!collapsed && (
          <div className="flex items-center ml-2 space-x-1">
            <span className="h-2 w-2 rounded-full bg-[#4285F4]"></span>
            <span className="h-2 w-2 rounded-full bg-[#EA4335]"></span>
            <span className="h-2 w-2 rounded-full bg-[#FBBC05]"></span>
            <span className="h-2 w-2 rounded-full bg-[#34A853]"></span>
            <span className="h-2 w-2 rounded-full bg-[#1877F2] ml-1"></span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto pb-10 pt-2">
        <nav className="grid items-start px-2 gap-1">
          {/* Google Ads Section */}
          {!collapsed && (
            <div className="ml-3 mt-2 mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Google Ads</div>
          )}
          <NavItem
            href="/dashboard?platform=google"
            icon={LayoutDashboard}
            text="Campaigns"
            collapsed={collapsed}
            active={pathname === "/dashboard" || pathname.includes("/dashboard?platform=google")}
            color="#4285F4"
          />
          <NavItem
            href="/analytics?platform=google"
            icon={BarChart}
            text="Performance"
            collapsed={collapsed}
            active={pathname === "/analytics" && pathname.includes("?platform=google")}
            color="#EA4335"
          />
          <NavItem
            href="/settings/accounts?platform=google"
            icon={Target}
            text="Ad Targeting"
            collapsed={collapsed}
            active={pathname === "/settings/accounts" && pathname.includes("?platform=google")}
            color="#34A853"
          />
          
          {/* Divider */}
          <div className="my-2 border-t mx-2"></div>

          {/* Facebook Ads Section */}
          {!collapsed && (
            <div className="ml-3 mt-2 mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Facebook Ads</div>
          )}
          <NavItem
            href="/dashboard?platform=facebook"
            icon={LayoutDashboard}
            text="Campaigns"
            collapsed={collapsed}
            active={pathname.includes("/dashboard?platform=facebook")}
            color="#1877F2"
          />
          <NavItem
            href="/analytics?platform=facebook"
            icon={BarChart3}
            text="Performance"
            collapsed={collapsed}
            active={pathname === "/analytics" && pathname.includes("?platform=facebook")}
            color="#1877F2"
          />
          <NavItem
            href="/settings/accounts?platform=facebook"
            icon={Share2}
            text="Audience"
            collapsed={collapsed}
            active={pathname === "/settings/accounts" && pathname.includes("?platform=facebook")}
            color="#1877F2"
          />
          
          {/* Divider */}
          <div className="my-2 border-t mx-2"></div>

          {/* Settings Section */}
          {!collapsed && (
            <div className="ml-3 mt-2 mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Settings</div>
          )}
          <NavItem
            href="/team"
            icon={Users}
            text="Team"
            collapsed={collapsed}
            active={pathname === "/team"}
          />
          <NavItem
            href="/settings"
            icon={Settings}
            text="Settings"
            collapsed={collapsed}
            active={pathname === "/settings"}
          />
        </nav>
      </div>
      
      {/* Collapse button */}
      <Button
        onClick={() => setCollapsed(!collapsed)}
        variant="ghost"
        size="icon"
        className="absolute right-[-12px] top-20 h-6 w-6 rounded-full border bg-background shadow-md"
      >
        <ChevronLeft className={cn(
          "h-3 w-3 transition-transform",
          collapsed ? "rotate-180" : "rotate-0"
        )} />
      </Button>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  text: string
  active?: boolean
  collapsed?: boolean
  color?: string
}

function NavItem({
  href,
  icon: Icon,
  text,
  active,
  collapsed,
  color = "#64748b"
}: NavItemProps) {
  // Inline styles for dynamic colors
  const activeStyleProps = {
    backgroundColor: `${color}10`, // 10% opacity
    color: color,
    fontWeight: 500
  };
  
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
        active ? "font-medium" : "text-gray-600 dark:text-gray-400"
      )}
      style={active ? activeStyleProps : undefined}
    >
      <Icon 
        className={cn(
          "h-4 w-4", 
          collapsed ? "mr-0" : "mr-2",
          active ? "text-" + color.replace('#', '') : "text-gray-500"
        )} 
      />
      {!collapsed && <span>{text}</span>}
    </Link>
  )
} 