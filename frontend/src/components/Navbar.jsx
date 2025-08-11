import { Button } from "./ui/button"

export function Navbar() {
  return (
    <nav className="w-full bg-transparent backdrop-blur-sm border-b border-border/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-foreground">StockAnalyzer</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            About
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Support
          </Button>
        </div>
      </div>
    </nav>
  )
}