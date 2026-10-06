import { useEffect, useState } from "react";
import { ArrowUpRight, Car, CalendarDays, CircleDollarSign, Users, MapPinned, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { bookingApi, parkingApi, userApi } from "../services/api";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

export default function Overview() {
  const [data, setData] = useState({ spots: [], bookings: [], users: [] });
  const [error, setError] = useState("");
  const load = async () => {
    setError("");
    try {
      const [s,b,u] = await Promise.all([parkingApi.all(), bookingApi.all(), userApi.all()]);
      setData({spots:s.data || [], bookings:b.data || [], users:u.data || []});
    } catch(e) { setError(e.message); }
  };
  useEffect(() => { load(); }, []);

  const available = data.spots.filter(s => s.available).length;
  const confirmed = data.bookings.filter(b => b.status === "CONFIRMED").length;
  const recent = [...data.bookings].sort((a,b) => (b.id||0)-(a.id||0)).slice(0,5);

  return <div className="page">
    {error && <ErrorState message={error} onRetry={load}/>}
    <div className="welcome-card">
      <div><span className="eyebrow">PARKING OPERATIONS</span><h2>Good morning, <span>Admin.</span></h2><p>Monitor your parking network, bookings and customers from one place.</p></div>
      <div className="welcome-art"><MapPinned size={88}/></div>
    </div>

    <div className="stats-grid">
      <StatCard icon={<Car/>} label="Total spots" value={data.spots.length} note={`${available} currently available`} tone="teal"/>
      <StatCard icon={<CalendarDays/>} label="Confirmed bookings" value={confirmed} note={`${data.bookings.length} total records`} tone="blue"/>
      <StatCard icon={<Users/>} label="Customers" value={data.users.length} note="Registered users" tone="purple"/>
      <StatCard icon={<CircleDollarSign/>} label="Operations" value="Live" note="Connected to Spring Boot" tone="orange"/>
    </div>

    <div className="two-col">
      <section className="panel">
        <div className="panel-head"><div><span className="eyebrow">RECENT ACTIVITY</span><h3>Latest bookings</h3></div><Link to="/manage/bookings" className="link-btn">View all <ArrowUpRight size={15}/></Link></div>
        {recent.length ? <div className="table-wrap"><table><thead><tr><th>ID</th><th>Customer</th><th>Spot</th><th>Status</th></tr></thead><tbody>
          {recent.map(b => <tr key={b.id}><td className="mono">#{b.id}</td><td><strong>{b.user?.name || "Customer"}</strong><small>{b.user?.email || "—"}</small></td><td>{b.parkingSpot?.spotNumber || "—"}</td><td><StatusBadge status={b.status}/></td></tr>)}
        </tbody></table></div> : <EmptyState title="No bookings yet" text="Confirmed reservations will appear here."/>}
      </section>
      <section className="panel">
        <div className="panel-head"><div><span className="eyebrow">CAPACITY</span><h3>Parking availability</h3></div><Link to="/manage/parking" className="link-btn">Explore <ArrowUpRight size={15}/></Link></div>
        <div className="capacity"><div className="capacity-ring" style={{"--pct": data.spots.length ? `${Math.round(available/data.spots.length*100)}%` : "0%"}}><strong>{data.spots.length ? Math.round(available/data.spots.length*100) : 0}%</strong><span>available</span></div><div className="capacity-copy"><div><i className="dot teal"/><span>Available</span><b>{available}</b></div><div><i className="dot gray"/><span>Occupied</span><b>{data.spots.length-available}</b></div><div><i className="dot blue"/><span>Total</span><b>{data.spots.length}</b></div></div></div>
        <div className="quick-links"><Link to="/manage"><Clock3 size={17}/><span>Manage parking spots</span><ArrowUpRight size={15}/></Link><Link to="/manage/users"><Users size={17}/><span>View customers</span><ArrowUpRight size={15}/></Link></div>
      </section>
    </div>
  </div>
}