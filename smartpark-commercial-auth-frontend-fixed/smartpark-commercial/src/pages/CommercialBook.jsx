import{useEffect,useState}from'react';
import{useLocation,useNavigate}from'react-router-dom';
import{CalendarClock,CarFront,CheckCircle2,ArrowLeft,UserRound}from'lucide-react';
import{bookingApi,parkingApi,apiError}from'../services/api';
import{useAuth}from'../context/AuthContext';

const CURRENT_USER_KEY='smartpark.currentUserId';
const toInput=v=>v?new Date(v).toISOString().slice(0,16):'';
export default function CommercialBook(){
 const p=new URLSearchParams(useLocation().search),[spots,setSpots]=useState([]),[spot,setSpot]=useState(p.get('spot')||''),[err,setErr]=useState(''),[busy,setBusy]=useState(false),nav=useNavigate(),{user}=useAuth(),[f,setF]=useState({startTime:toInput(new Date(Date.now()+30*60000)),endTime:toInput(new Date(Date.now()+90*60000))});
 useEffect(()=>{parkingApi.available().then(a=>{const ss=a.data||[];setSpots(ss);if(!spot&&ss[0])setSpot(String(ss[0].id))}).catch(e=>setErr(apiError(e)))},[]);
 const selected=spots.find(x=>String(x.id)===String(spot));
 const submit=async e=>{e.preventDefault();setErr('');if(!user||!spot){setErr('Please sign in and select a parking spot.');return}if(new Date(f.endTime)<=new Date(f.startTime)){setErr('End time must be after start time.');return}setBusy(true);try{await bookingApi.create(Number(user.id),Number(spot),f);nav('/bookings?success=1')}catch(e){setErr(apiError(e))}finally{setBusy(false)}};
 return <div className="checkout"><div className="back" onClick={()=>nav('/')}><ArrowLeft size={15}/> Back to parking</div><div className="checkout-grid"><div><span className="kicker dark">RESERVE YOUR SPOT</span><h1>Complete your booking</h1><p className="sub">Choose who is parking and when you need the space.</p><form onSubmit={submit}><div className="signed-in-box"><UserRound size={16}/><div><b>{user.name}</b><small>{user.email}</small></div></div><label><span><CarFront size={14}/> Parking spot</span><select required value={spot} onChange={e=>setSpot(e.target.value)}>{spots.map(x=><option key={x.id} value={x.id}>{x.spotNumber} · {x.location}</option>)}</select></label><div className="dates"><label><span>Start time</span><input required type="datetime-local" value={f.startTime} onChange={e=>setF({...f,startTime:e.target.value})}/></label><label><span>End time</span><input required type="datetime-local" value={f.endTime} onChange={e=>setF({...f,endTime:e.target.value})}/></label></div>{err&&<div className="err">{String(err)}</div>}<button className="primary full" disabled={busy}>{busy?'Confirming...':<><CheckCircle2 size={17}/> Confirm reservation</>}</button></form></div><aside className="summary"><span>YOUR SELECTION</span><div className="summary-art"><CarFront size={44}/></div><h2>{selected?.spotNumber||'Parking spot'}</h2><p>{selected?.location||'Selected parking location'}</p><div><CalendarClock size={14}/> Scheduled reservation</div><small>Booking is created directly through your SmartPark backend.</small></aside></div></div>
}
