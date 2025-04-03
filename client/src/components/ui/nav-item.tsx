import { LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

interface NavItemProps {
  route: string
  title: string
  icon: LucideIcon
  collapsed?: boolean
}

export function NavItem({ route, title, icon: Icon, collapsed }: NavItemProps) {
  const location = useLocation()
  const isActive = location.pathname === route

  return (
    <Link
      to={route}
      className={cn(
        "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-nowrap",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-2"
      )}
      title={title}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{title}</span>}
    </Link>
  )
} 