import { useState } from "react"
import { ChevronLeft, ChevronRight, TrendingUp, BarChart3, PieChart, Activity, Settings } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Button } from "./ui/button"
import { SettingsModal } from "./SettingsModal"
import { useTheme } from "./ThemeProvider"

export function AppSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const { theme } = useTheme()

  const toggleSidebar = () => setIsOpen(!isOpen)

  const sidebarSections = [
    { icon: TrendingUp, label: "Market Overview", active: true },
    { icon: BarChart3, label: "Technical Analysis", active: false },
    { icon: PieChart, label: "Portfolio", active: false },
    { icon: Activity, label: "Watchlist", active: false },
  ]

  const tooltipContent = (
    <div className="text-xs">
      <div className="font-medium mb-1">Settings</div>
      <div className="text-muted-foreground">
        Current theme: <span className="capitalize">{theme}</span>
        <br />
        Click to change theme & preferences
      </div>
    </div>
  )

  return (
    <div className={`${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-sidebar border-r border-sidebar-border h-full flex flex-col`}>
      {/* Toggle Button */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {isOpen && <span className="ml-2">Collapse</span>}
        </Button>
      </div>

      {/* Main Sections */}
      <div className="flex-1 p-4 space-y-2">
        {sidebarSections.map((section, index) => (
          <Button
            key={index}
            variant={section.active ? "default" : "ghost"}
            className={`w-full justify-start ${
              section.active 
                ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <section.icon className="h-4 w-4" />
            {isOpen && <span className="ml-3">{section.label}</span>}
          </Button>
        ))}
      </div>

      {/* Settings Section */}
      <div className="p-4 border-t border-sidebar-border">
        {isOpen ? (
          <SettingsModal showTooltip={false} />
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SettingsModal 
                  showTooltip={false}
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent p-2 group"
                    >
                      <Settings className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                    </Button>
                  }
                />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-48">
                {tooltipContent}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}