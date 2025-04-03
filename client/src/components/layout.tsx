import { useState } from "react"
import { TopNav } from "@/components/ui/top-nav"
import { Sidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden hardware-accelerated">
      <TopNav />
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className={cn(
        "pt-16 min-h-screen w-full max-w-full overflow-x-hidden transform transition-transform duration-300 ease-in-out hardware-accelerated",
        collapsed ? "md:translate-x-16 pr-16" : "md:translate-x-52"
      )}>
        <div className="p-4 md:p-6 space-y-4 w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
} 