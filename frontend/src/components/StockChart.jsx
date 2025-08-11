import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

// Mock data for the chart
const chartData = [
  { time: "9:30", price: 150.25, volume: 1250000 },
  { time: "10:00", price: 152.80, volume: 980000 },
  { time: "10:30", price: 151.45, volume: 1100000 },
  { time: "11:00", price: 154.20, volume: 1350000 },
  { time: "11:30", price: 156.75, volume: 890000 },
  { time: "12:00", price: 155.30, volume: 750000 },
  { time: "12:30", price: 158.90, volume: 1200000 },
  { time: "13:00", price: 157.65, volume: 950000 },
  { time: "13:30", price: 159.40, volume: 1150000 },
  { time: "14:00", price: 161.25, volume: 1300000 },
  { time: "14:30", price: 160.80, volume: 850000 },
  { time: "15:00", price: 162.15, volume: 1400000 },
]

export function StockChart() {
  const [timeframe, setTimeframe] = useState("1D")
  const [symbol, setSymbol] = useState("AAPL")

  const timeframes = ["1D", "5D", "1M", "3M", "6M", "1Y"]

  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/20">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Stock Price Chart</CardTitle>
          <div className="flex items-center gap-4">
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AAPL">AAPL</SelectItem>
                <SelectItem value="GOOGL">GOOGL</SelectItem>
                <SelectItem value="MSFT">MSFT</SelectItem>
                <SelectItem value="TSLA">TSLA</SelectItem>
                <SelectItem value="AMZN">AMZN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="text-xs"
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "hsl(var(--chart-1))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}