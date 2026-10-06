import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3, CarFront, CalendarCheck2, LayoutDashboard,
  MapPin, Settings2, Users, Menu, X, CircleHelp
} from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/parking", label: "Parking", icon: MapPin },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck2 },
  { to: "/users", label: "Customers", icon: Users },
  { to: "/manage", label: "Manage spots", icon: Settings2 },
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const current = links.find(x => x.to === location.pathname)?.label || "SmartPark";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><CarFront size={22}/></div>
          <div><strong>Smart<span>Park</span></strong><small>Parking platform</small></div>
          <button className="mobile-close" onClick={() => setOpen(false)}><X size={20}/></button>
        </div>
        <div className="side-section-label">WORKSPACE</div>
        <nav className="side-nav">
          {links.map(({to,label,icon:Icon}) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>
              <Icon size={18}/><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="side-help">
          <div className="help-icon"><CircleHelp size={18}/></div>
          <div><strong>Need help?</strong><p>Check API connection and setup.</p></div>
        </div>
        <div className="sidebar-footer">
          <div className="avatar">SP</div>
          <div><strong>Parking Admin</strong><span>Management console</span></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <button className="mobile-menu" onClick={() => setOpen(true)}><Menu size={21}/></button>
            <div className="crumb"><span>Workspace</span><b>/</b>{current}</div>
            <h1>{current}</h1>
          </div>
          <div className="top-actions">
            <div className="live"><i/> API connected</div>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
      {open && <div className="overlay" onClick={() => setOpen(false)}/>}
    </div>
  );
}