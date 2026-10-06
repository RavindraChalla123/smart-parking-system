import { Inbox } from "lucide-react";
export default function EmptyState({ title="Nothing here yet", text="There is no data to display." }) {
  return <div className="empty"><div className="empty-icon"><Inbox size={24}/></div><h3>{title}</h3><p>{text}</p></div>;
}