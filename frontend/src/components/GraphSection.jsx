import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/GraphSection.css";

const graphData = [
  { name: "Day 1", open: 120, high: 130, low: 115, close: 125 },
  { name: "Day 2", open: 125, high: 135, low: 120, close: 130 },
  { name: "Day 3", open: 130, high: 140, low: 128, close: 138 },
  { name: "Day 4", open: 138, high: 145, low: 135, close: 142 },
  { name: "Day 5", open: 142, high: 150, low: 138, close: 148 }
];

export default function GraphSection() {
  return (
    <div className="graph-container">
      <h2>Graph Section</h2>
      <div className="graph-buttons">
        <button>O</button>
        <button>H</button>
        <button>L</button>
        <button>C</button>
      </div>
      <div className="graph-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="close" stroke="#0095b7" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}