import { useEffect, useState } from "react";
import { Mail, Plus, ShieldCheck, UserRound } from "lucide-react";
import { userApi, apiError } from "../services/api";
import EmptyState from "../components/EmptyState";

export default function Users(){
  const [users,setUsers]=useState([]),[show,setShow]=useState(false),[form,setForm]=useState({name:"",email:"",password:"",role:"USER"}),[error,setError]=useState("");
  const load=()=>userApi.all().then(r=>setUsers(r.data||[])).catch(e=>setError(apiError(e)));
  useEffect(load,[]);
  const add=async e=>{e.preventDefault();try{await userApi.create(form);setShow(false);setForm({name:"",email:"",password:"",role:"USER"});load()}catch(e){setError(apiError(e))}};
  return <div className="page">
    <div className="page-toolbar"><div><span className="eyebrow">CUSTOMERS</span><h2>Users</h2><p>Manage customer records used for parking reservations.</p></div><button className="btn primary" onClick={()=>setShow(true)}><Plus size={17}/> Add customer</button></div>
    {error&&<div className="form-error">{error}</div>}
    {users.length?<div className="user-grid">{users.map(u=><div className="user-card" key={u.id}><div className="avatar large">{(u.name||"U").slice(0,1).toUpperCase()}</div><div><h3>{u.name}</h3><p><Mail size={14}/>{u.email}</p><span className="role"><ShieldCheck size={13}/>{u.role||"USER"}</span></div></div>)}</div>:<EmptyState title="No customers yet" text="Create a customer before making a booking."/>}
    {show&&<div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><span className="eyebrow">CUSTOMER</span><h3>Add customer</h3></div><button className="modal-x" onClick={()=>setShow(false)}>×</button></div><form className="form" onSubmit={add}><label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Password<input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label><label>Role<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option>USER</option><option>ADMIN</option></select></label><div className="modal-actions"><button type="button" className="btn ghost" onClick={()=>setShow(false)}>Cancel</button><button className="btn primary"><UserRound size={16}/> Create user</button></div></form></div></div>}
  </div>
}