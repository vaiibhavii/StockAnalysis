import { LineChart, Line, ResponsiveContainer } from "recharts";
import "../styles/StockMiniCard.css";

const dummyData = [
  { value: 120 }, { value: 135 }, { value: 128 },
  { value: 150 }, { value: 140 }, { value: 160 },
  { value: 155 }
];

export default function StockMiniCard({ name }) {
  return (
    <div className="stock-mini-card">
      <span className="stock-name">{name}</span>
      <div className="sparkline">
        <ResponsiveContainer width="100%" height={50}>
          <LineChart data={dummyData}>
            <Line type="monotone" dataKey="value" stroke="#00799c" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}