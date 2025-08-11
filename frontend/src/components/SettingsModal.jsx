import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Button } from "./ui/button"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { Settings, Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export function SettingsModal({ trigger, showTooltip = true }) {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const defaultTrigger = (
    <Button
      variant="ghost"
      className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent group"
    >
      <Settings className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
      <span className="ml-3">Settings</span>
    </Button>
  )

  const collapsedTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent p-2 group"
    >
      <Settings className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
    </Button>
  )

  const triggerElement = trigger || defaultTrigger

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

  if (showTooltip && !trigger) {
    return (
      <TooltipProvider>
        <Tooltip>
          <Dialog open={open} onOpenChange={setOpen}>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                {triggerElement}
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-48">
              {tooltipContent}
            </TooltipContent>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Theme Section */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Appearance</h4>
                    <p className="text-xs text-muted-foreground">
                      Choose your preferred color theme
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode" className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark Mode
                      </Label>
                      <Switch
                        id="dark-mode"
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="light-mode" className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light Mode
                      </Label>
                      <Switch
                        id="light-mode"
                        checked={theme === 'light'}
                        onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional Settings Sections */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Data & Privacy</h4>
                    <p className="text-xs text-muted-foreground">
                      Manage your data preferences
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-refresh">Auto-refresh data</Label>
                      <Switch id="auto-refresh" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Push notifications</Label>
                      <Switch id="notifications" defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Display</h4>
                    <p className="text-xs text-muted-foreground">
                      Customize your dashboard layout
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="compact-view">Compact view</Label>
                      <Switch id="compact-view" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-tooltips">Show tooltips</Label>
                      <Switch id="show-tooltips" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // For custom triggers or when tooltip is disabled
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerElement}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Theme Section */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Appearance</h4>
              <p className="text-xs text-muted-foreground">
                Choose your preferred color theme
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark Mode
                </Label>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="light-mode" className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Light Mode
                </Label>
                <Switch
                  id="light-mode"
                  checked={theme === 'light'}
                  onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Settings Sections */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Data & Privacy</h4>
              <p className="text-xs text-muted-foreground">
                Manage your data preferences
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-refresh">Auto-refresh data</Label>
                <Switch id="auto-refresh" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Push notifications</Label>
                <Switch id="notifications" defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Display</h4>
              <p className="text-xs text-muted-foreground">
                Customize your dashboard layout
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-view">Compact view</Label>
                <Switch id="compact-view" />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-tooltips">Show tooltips</Label>
                <Switch id="show-tooltips" defaultChecked />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}