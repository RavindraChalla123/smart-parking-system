export default function StatusBadge({ status }) {
  const value = String(status || "").toUpperCase();
  const cls = value === "CONFIRMED" || value === "AVAILABLE" ? "success"
    : value === "CANCELLED" ? "danger" : "neutral";
  return <span className={`badge ${cls}`}><i/>{value || "UNKNOWN"}</span>;
}