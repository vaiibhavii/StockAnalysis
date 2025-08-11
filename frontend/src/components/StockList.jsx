import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

const stockData = [
  { symbol: "AAPL", name: "Apple Inc.", price: 162.15, change: 2.35, changePercent: 1.47, trend: "up" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 2847.92, change: -12.45, changePercent: -0.44, trend: "down" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 329.68, change: 4.82, changePercent: 1.48, trend: "up" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 891.34, change: -23.12, changePercent: -2.53, trend: "down" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 3247.89, change: 15.67, changePercent: 0.48, trend: "up" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 542.78, change: 8.94, changePercent: 1.68, trend: "up" },
  { symbol: "META", name: "Meta Platforms", price: 198.23, change: -3.45, changePercent: -1.71, trend: "down" },
  { symbol: "NFLX", name: "Netflix Inc.", price: 456.89, change: 12.34, changePercent: 2.78, trend: "up" },
]

export function StockList() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/20 h-fit">
      <CardHeader>
        <CardTitle className="text-foreground">Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {stockData.map((stock, index) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors border-b border-border/20 last:border-b-0"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{stock.symbol}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stock.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate max-w-32">
                  {stock.name}
                </p>
              </div>
              
              <div className="text-right space-y-1">
                <p className="font-semibold text-foreground">${stock.price.toFixed(2)}</p>
                <div className="flex items-center gap-1">
                  <span className={`text-sm ${
                    stock.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}>
                    {stock.trend === "up" ? "+" : ""}{stock.change.toFixed(2)}
                  </span>
                  <span className={`text-xs ${
                    stock.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}>
                    ({stock.trend === "up" ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}