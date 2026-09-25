import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/index.js';
import { ApiClient } from '../lib/api.js';
type Result = { success: boolean; message?: string; role?: UserRole };
interface AuthContextType {
 user: User | null; role: UserRole; pointsBalance: number; isLoading: boolean;
 login: (email: string, password: string) => Promise<Result>;
 loginGoogle: (credential: string, nonce: string) => Promise<Result>;
 register: (name: string, email: string, password: string) => Promise<Result>;
 logout: () => Promise<Result>; refreshUserData: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{children:ReactNode}> = ({children}) => {
 const [user,setUser]=useState<User|null>(null); const [isLoading,setLoading]=useState(true);
 useEffect(()=>{const expired=()=>setUser(null);window.addEventListener('takono:session-expired',expired);ApiClient.getCurrentUser().then(res=>{setUser(res.success?res.data || null:null);setLoading(false);});return()=>window.removeEventListener('takono:session-expired',expired);},[]);
 const login=async(email:string,password:string)=>{const r=await ApiClient.login(email,password);if(r.success&&r.data)setUser(r.data.user);return {...r,role:r.data?.user.role};};
 const loginGoogle=async(credential:string,nonce:string)=>{const r=await ApiClient.loginGoogle(credential,nonce);if(r.success&&r.data)setUser(r.data.user);return {...r,role:r.data?.user.role};};
 const register=async(name:string,email:string,password:string)=>{const r=await ApiClient.register(name,email,password);if(r.success&&r.data)setUser(r.data.user);return r;};
 const logout=async()=>{const r=await ApiClient.logout();if(r.success){ApiClient.removeToken();setUser(null);}return r;};
 const refreshUserData=async()=>{const r=await ApiClient.getCurrentUser();if(r.success&&r.data)setUser(r.data);};
 return <AuthContext.Provider value={{user,role:user?.role||'traveler',pointsBalance:user?.pointsBalance||0,isLoading,login,loginGoogle,register,logout,refreshUserData}}>{children}</AuthContext.Provider>;
};
export const useAuth=()=>{const c=useContext(AuthContext);if(!c)throw new Error('AuthProvider required');return c;};
