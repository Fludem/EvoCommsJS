import { Activity, BarChart3, ChevronLeft, LayoutDashboard, Tablet } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavItem } from "./nav-item"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col border-r bg-background hardware-accelerated",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-52"
      )}
    >
      <div className="h-16 flex items-center justify-between border-b px-4">
        {!collapsed && <h2 className="text-lg font-semibold">EvoCommms</h2>}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", collapsed ? "mx-auto" : "ml-auto")}
          onClick={() => onCollapsedChange(!collapsed)}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-200 ease-in",
            collapsed && "rotate-180"
          )} />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-3 py-2">
          {!collapsed && (
            <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </h3>
          )}
          <div className="space-y-1">
            <NavItem
              route="/dashboard"
              title="Dashboard"
              icon={LayoutDashboard}
              collapsed={collapsed}
            />
            <NavItem
              route="/clocking-machines"
              title="Clocking Machines"
              icon={Tablet}
              collapsed={collapsed}
            />
            <NavItem
              route="/activity"
              title="Activity Log"
              icon={Activity}
              collapsed={collapsed}
            />
            <NavItem
              route="/stats"
              title="Raw Stats"
              icon={BarChart3}
              collapsed={collapsed}
            />
          </div>
        </div>
      </nav>
    </div>
  )
}

