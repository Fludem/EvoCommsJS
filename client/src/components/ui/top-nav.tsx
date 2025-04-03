import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between w-full gap-4 border-b bg-background px-4 md:px-6">
      <div className="w-16 md:w-64 -ml-4 md:px-4"/>
      <nav className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        <Button variant="outline" size="sm">
          Settings
        </Button>
      </nav>
    </header>
  )
} 