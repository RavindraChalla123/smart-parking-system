import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute({children}){const{user,loading}=useAuth(),location=useLocation();if(loading)return <div className="auth-loading">Checking your account…</div>;if(!user)return <Navigate to="/login" replace state={{from:location.pathname+location.search}}/>;return children;}
