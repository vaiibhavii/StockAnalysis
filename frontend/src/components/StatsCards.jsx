import { Card, CardContent } from "./ui/card"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Portfolio Value",
      value: "$127,459.32",
      change: "+2.4%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Day's Gain/Loss",
      value: "+$3,247.89",
      change: "+1.8%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Total Return",
      value: "+$23,458.12",
      change: "+22.5%",
      trend: "up",
      icon: Activity,
    },
    {
      title: "Active Positions",
      value: "12",
      change: "-2 from yesterday",
      trend: "down",
      icon: TrendingDown,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card/50 backdrop-blur-sm border border-border/20 hover:bg-card/70 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className={`text-xs ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${
                stat.trend === 'up' ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}>
                <stat.icon className={`h-4 w-4 ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}