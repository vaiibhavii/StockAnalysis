import { ThemeProvider } from "./components/ThemeProvider"
import { Navbar } from "./components/Navbar"
import { AppSidebar } from "./components/AppSidebar"
import { StatsCards } from "./components/StatsCards"
import { StockChart } from "./components/StockChart"
import { StockList } from "./components/StockList"

export default function App() {
  return (
    <ThemeProvider>
      <div className="h-screen bg-background flex flex-col">
        {/* Navbar */}
        <Navbar />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <AppSidebar />
          
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {/* Stats Cards Strip */}
            <StatsCards />
            
            {/* Chart and List Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 pt-0">
              {/* Chart takes 2/3 of the space */}
              <div className="lg:col-span-2">
                <StockChart />
              </div>
              
              {/* Stock List takes 1/3 of the space */}
              <div className="lg:col-span-1">
                <StockList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}