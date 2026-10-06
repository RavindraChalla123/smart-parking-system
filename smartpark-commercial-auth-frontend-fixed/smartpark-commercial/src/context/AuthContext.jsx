import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, apiError } from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [loading, setLoading] = useState(true);
  useEffect(() => { authApi.me().then(r=>setUser(r.data)).catch(()=>setUser(null)).finally(()=>setLoading(false)); }, []);
  const value = useMemo(() => ({
    user, loading,
    login: async (email,password)=>{try{const r=await authApi.login({email,password});setUser(r.data);return r.data}catch(e){throw new Error(apiError(e))}},
    register: async (name,email,password)=>{try{const r=await authApi.register({name,email,password});setUser(r.data);return r.data}catch(e){throw new Error(apiError(e))}},
    logout: async()=>{try{await authApi.logout()}finally{setUser(null)}}
  }),[user,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){const v=useContext(AuthContext);if(!v)throw new Error('useAuth must be used inside AuthProvider');return v;}
