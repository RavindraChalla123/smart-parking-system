import { useEffect, useState } from "react";
import { CalendarClock, UserRound, CarFront, CheckCircle2 } from "lucide-react";
import { bookingApi, parkingApi, userApi } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Book() {
  const [users,setUsers]=useState([]),[spots,setSpots]=useState([]),[form,setForm]=useState({userId:"",parkingSpotId:"",startTime:"",endTime:""}),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
  const nav=useNavigate();
  useEffect(()=>{Promise.all([userApi.all(),parkingApi.available()]).then(([u,s])=>{setUsers(u.data||[]);setSpots(s.data||[]);})},[]);
  const submit=async e=>{e.preventDefault();setBusy(true);setMessage("");try{await bookingApi.create(Number(form.userId),Number(form.parkingSpotId),{startTime:form.startTime,endTime:form.endTime});nav("/bookings")}catch(e){setMessage(e.response?.data?.message||e.response?.data||e.message)}finally{setBusy(false)}};
  return <div className="page narrow-page"><div className="page-toolbar"><div><span className="eyebrow">NEW RESERVATION</span><h2>Book a parking spot</h2><p>Create a reservation using the live Spring Boot API.</p></div></div>
    <form className="booking-form panel" onSubmit={submit}>
      <div className="form-section"><h3><UserRound size={18}/> Customer</h3><label>Select customer<select required value={form.userId} onChange={e=>setForm({...form,userId:e.target.value})}><option value="">Choose a customer</option>{users.map(u=><option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}</select></label></div>
      <div className="form-section"><h3><CarFront size={18}/> Parking</h3><label>Available spot<select required value={form.parkingSpotId} onChange={e=>setForm({...form,parkingSpotId:e.target.value})}><option value="">Choose a spot</option>{spots.map(s=><option key={s.id} value={s.id}>{s.spotNumber} — {s.location}</option>)}</select></label></div>
      <div className="form-section"><h3><CalendarClock size={18}/> Schedule</h3><div className="date-grid"><label>Start time<input required type="datetime-local" value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})}/></label><label>End time<input required type="datetime-local" value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})}/></label></div></div>
      {message&&<div className="form-error">{message}</div>}
      <div className="form-actions"><button type="button" className="btn ghost" onClick={()=>nav("/bookings")}>Cancel</button><button className="btn primary" disabled={busy}>{busy?"Creating...":<><CheckCircle2 size={17}/> Confirm booking</>}</button></div>
    </form>
  </div>
}