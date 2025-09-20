import "../styles/Card.css";

export default function Card({ title }) {
  return (
    <div className="info-card">
      <h2>{title}</h2>
      <p>Data Placeholder</p>
    </div>
  );
}