import { useEffect, useState } from "react";
import { Search, Plus, MapPin, CarFront, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { parkingApi, apiError } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function Parking() {
  const [spots,setSpots]=useState([]), [q,setQ]=useState(""), [error,setError]=useState(""), [editing,setEditing]=useState(null), [show,setShow]=useState(false);
  const load=()=>parkingApi.all().then(r=>setSpots(r.data||[])).catch(e=>setError(apiError(e)));
  useEffect(load,[]);
  const filtered=spots.filter(s=>`${s.spotNumber} ${s.location}`.toLowerCase().includes(q.toLowerCase()));
  const remove=async id=>{ if(!confirm("Delete this parking spot?")) return; try{await parkingApi.remove(id);load()}catch(e){setError(apiError(e))} };
  return <div className="page">
    <div className="page-toolbar"><div><span className="eyebrow">NETWORK</span><h2>Parking spots</h2><p>View availability across every registered parking spot.</p></div><button className="btn primary" onClick={()=>{setEditing(null);setShow(true)}}><Plus size={17}/> Add spot</button></div>
    {error && <ErrorState message={error} onRetry={load}/>}
    <div className="search-row"><div className="search"><Search size={18}/><input placeholder="Search by spot number or location..." value={q} onChange={e=>setQ(e.target.value)}/></div><span className="result-count">{filtered.length} spots</span></div>
    {filtered.length ? <div className="spot-grid">{filtered.map(s=><div className="spot-card" key={s.id}>
      <div className="spot-top"><div className="spot-number"><CarFront size={19}/><strong>{s.spotNumber || `Spot ${s.id}`}</strong></div><StatusBadge status={s.available ? "AVAILABLE":"OCCUPIED"}/></div>
      <div className="spot-location"><MapPin size={15}/>{s.location || "No location set"}</div>
      <div className="spot-bottom"><span><i className={`availability-dot ${s.available?"on":"off"}`}/>{s.available?"Ready for booking":"Currently occupied"}</span><div className="row-actions"><button title="Edit" onClick={()=>{setEditing(s);setShow(true)}}><Pencil size={15}/></button><button title="Delete" onClick={()=>remove(s.id)}><Trash2 size={15}/></button></div></div>
    </div>)}</div> : <EmptyState title="No parking spots found" text={q ? "Try a different search." : "Add your first parking spot to get started."}/>}
    {show && <SpotModal spot={editing} close={()=>setShow(false)} saved={()=>{setShow(false);load()}}/>}
  </div>
}

function SpotModal({spot,close,saved}) {
  const [form,setForm]=useState({spotNumber:spot?.spotNumber||"",location:spot?.location||"",available:spot?.available ?? true}), [busy,setBusy]=useState(false), [error,setError]=useState("");
  const submit=async e=>{e.preventDefault();setBusy(true);setError("");try{spot?await parkingApi.update(spot.id,form):await parkingApi.create(form);saved()}catch(e){setError(apiError(e))}finally{setBusy(false)}};
  return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><span className="eyebrow">{spot?"EDIT SPOT":"NEW SPOT"}</span><h3>{spot?"Update parking spot":"Add parking spot"}</h3></div><button className="modal-x" onClick={close}>×</button></div>
    <form onSubmit={submit} className="form"><label>Spot number<input required value={form.spotNumber} onChange={e=>setForm({...form,spotNumber:e.target.value})} placeholder="A-101"/></label><label>Location<input required value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Main entrance"/></label><label className="switch-row"><span>Available for booking</span><input type="checkbox" checked={form.available} onChange={e=>setForm({...form,available:e.target.checked})}/></label>{error&&<div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="btn ghost" onClick={close}>Cancel</button><button className="btn primary" disabled={busy}>{busy?"Saving...":<><CheckCircle2 size={16}/> Save spot</>}</button></div></form>
  </div></div>
}