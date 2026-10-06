import { RefreshCw, TriangleAlert } from "lucide-react";
export default function ErrorState({ message, onRetry }) {
  return <div className="error-state"><TriangleAlert size={22}/><div><strong>Couldn’t load this data</strong><p>{message || "Check that Spring Boot is running and the API URL is correct."}</p></div>{onRetry && <button className="btn ghost" onClick={onRetry}><RefreshCw size={16}/> Retry</button>}</div>;
}