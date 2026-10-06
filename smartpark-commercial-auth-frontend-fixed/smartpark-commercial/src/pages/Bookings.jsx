import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, XCircle, RefreshCw } from "lucide-react";
import { bookingApi, userApi, apiError } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

const fmt = v => v ? new Date(v).toLocaleString([], {dateStyle:"medium",timeStyle:"short"}) : "—";
export default function Bookings() {
  const [bookings,setBookings]=useState([]),[users,setUsers]=useState([]),[filter,setFilter]=useState("ALL"),[error,setError]=useState("");
  const load=async()=>{try{setError("");const [b,u]=await Promise.all([bookingApi.all(),userApi.all()]);setBookings(b.data||[]);setUsers(u.data||[])}catch(e){setError(apiError(e))}};
  useEffect(()=>{load()},[]);
  const shown=useMemo(()=>bookings.filter(b=>filter==="ALL"||b.status===filter),[bookings,filter]);
  const cancel=async id=>{if(!confirm("Cancel this booking?"))return;try{await bookingApi.cancel(id);load()}catch(e){setError(apiError(e))}};
  return <div className="page">
    <div className="page-toolbar"><div><span className="eyebrow">RESERVATIONS</span><h2>Bookings</h2><p>Track reservations and manage their status.</p></div><button className="btn ghost" onClick={load}><RefreshCw size={16}/> Refresh</button></div>
    {error&&<ErrorState message={error} onRetry={load}/>}
    <div className="filter-tabs">{["ALL","CONFIRMED","CANCELLED"].map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x}<b>{x==="ALL"?bookings.length:bookings.filter(b=>b.status===x).length}</b></button>)}</div>
    {shown.length ? <div className="booking-table panel"><div className="table-wrap"><table><thead><tr><th>Booking</th><th>Customer</th><th>Parking</th><th>Schedule</th><th>Status</th><th></th></tr></thead><tbody>
      {shown.map(b=><tr key={b.id}><td><strong className="mono">#{String(b.id).padStart(4,"0")}</strong><small>Reservation</small></td><td><strong>{b.user?.name||"Customer"}</strong><small>{b.user?.email||"—"}</small></td><td><strong>{b.parkingSpot?.spotNumber||"—"}</strong><small>{b.parkingSpot?.location||"—"}</small></td><td><strong>{fmt(b.startTime)}</strong><small>to {fmt(b.endTime)}</small></td><td><StatusBadge status={b.status}/></td><td>{b.status==="CONFIRMED"&&<button className="icon-danger" title="Cancel" onClick={()=>cancel(b.id)}><XCircle size={17}/></button>}</td></tr>)}
    </tbody></table></div></div> : <EmptyState title="No bookings" text="Reservations matching this filter will appear here."/>}
  </div>
}