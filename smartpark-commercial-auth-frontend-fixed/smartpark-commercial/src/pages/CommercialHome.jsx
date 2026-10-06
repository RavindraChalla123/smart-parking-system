import{useEffect,useMemo,useState}from'react';
import{useNavigate}from'react-router-dom';
import{MapPin,Search,CarFront,Clock3,ShieldCheck,ArrowRight,Star,Sparkles}from'lucide-react';
import{parkingApi,apiError}from'../services/api';
import{useAuth}from'../context/AuthContext';
import ErrorState from'../components/ErrorState';

const CURRENT_USER_KEY='smartpark.currentUserId';
export default function CommercialHome(){
 const[s,setS]=useState([]),[q,setQ]=useState(''),[sel,setSel]=useState(null),[err,setErr]=useState(''),nav=useNavigate(),{user}=useAuth();
 useEffect(()=>{parkingApi.available().then(a=>setS(a.data||[])).catch(e=>setErr(apiError(e)))},[]);
 const list=useMemo(()=>s.filter(x=>`${x.spotNumber||''} ${x.location||''}`.toLowerCase().includes(q.toLowerCase())),[s,q]);
 const continueBooking=()=>{if(!user){nav('/login',{state:{from:`/book?spot=${sel.id}`}});return}nav(`/book?spot=${sel.id}`)};
 return <div className="shop">
  <section className="hero"><div><div className="kicker"><Sparkles size={13}/> SMART PARKING, MADE SIMPLE</div><h1>Park closer.<br/><span>Live better.</span></h1><p>Find an available parking spot, choose your time, and reserve in seconds.</p><div className="trust"><span><ShieldCheck size={14}/> Live availability</span><span><Clock3 size={14}/> Flexible booking</span></div></div><div className="hero-car"><div><CarFront size={80}/></div><aside><b>Easy to find</b><small>Near your destination</small></aside></div></section>
  {err&&<ErrorState message={err} onRetry={()=>window.location.reload()}/>} 
  <section className="search-box"><div className="search"><MapPin size={19}/><div><label>WHERE ARE YOU PARKING?</label><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by location or spot number"/></div><Search/></div><div className="booking-note">{user?<><b>Booking as {user.name}</b><small>{user.email}</small></>:<><b>Sign in to reserve</b><small>Your selected spot will be saved when you sign in.</small></>}</div></section>
  <section className="spots"><div className="section-head"><div><span className="kicker dark">AVAILABLE NOW</span><h2>Choose your parking spot</h2><p>Real-time availability from your parking system.</p></div><span className="count"><i/>{list.length} available</span></div>{list.length?<div className="cards">{list.map(x=><article className={sel?.id===x.id?'spot selected':'spot'} key={x.id} onClick={()=>setSel(x)}><div className="spot-photo"><div><CarFront size={28}/></div><b>● Available</b><em>{x.spotNumber||`P-${x.id}`}</em></div><div className="spot-body"><div className="spot-title"><h3>{x.location||'SmartPark Location'}</h3><span><Star size={12} fill="currentColor"/> 4.8</span></div><p><MapPin size={13}/> {x.spotNumber||'Parking spot'} · Easy access</p><div className="spot-meta"><span><Clock3 size={13}/> Reserve today</span><strong>Available</strong></div><button type="button">{sel?.id===x.id?'Selected':'Select spot'} <ArrowRight size={14}/></button></div></article>)}</div>:<div className="empty-shop"><CarFront size={30}/><h3>No spots found</h3><p>Try a different location or add parking spots from Management.</p></div>}</section>
  {sel&&<div className="sticky"><div><b>{sel.spotNumber||`Spot ${sel.id}`}</b><small>{sel.location||'Parking location'}</small></div><button type="button" onClick={continueBooking}>Continue to booking <ArrowRight size={16}/></button></div>}
  <section className="benefits"><div className="center"><span className="kicker dark">WHY SMARTPARK</span><h2>Parking without the hassle</h2></div><div className="benefit-grid"><B i={<MapPin/>} t="Easy to locate" d="Find parking by location and availability."/><B i={<ShieldCheck/>} t="Reliable booking" d="Reserve directly through your parking system."/><B i={<Clock3/>} t="Save your time" d="Skip the search and get moving."/></div></section>
 </div>
}
function B({i,t,d}){return <div className="benefit"><span>{i}</span><h3>{t}</h3><p>{d}</p></div>}
