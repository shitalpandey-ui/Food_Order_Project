//login state, user info

'use client';

import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService' ;
import { AUTH_EVENT } from '@/services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
   // use state is used to store the changing data and the below two line code is used to create two different state
    const [user , setUser] = useState(null);
    const [loading , setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
  const verifyUser = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const data = await authService.getprofile();
        setUser(data.user || data);
      } catch (error) {
        console.error('Session verification failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }

    setLoading(false);
  };

  verifyUser();
 }, []);

 // Any request that comes back 401 (expired/invalid token) clears login state here too.
 useEffect(() => {
   const handleUnauthorized = () => {
     setUser(null);
     router.push('/login');
   };
   window.addEventListener(AUTH_EVENT, handleUnauthorized);
   return () => window.removeEventListener(AUTH_EVENT, handleUnauthorized);
 }, [router]);

 const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      const loggedInUser = data.data?.user || data.user;
      localStorage.setItem('token', data.token);
      setUser(loggedInUser);
      router.push(loggedInUser?.role === 'admin' ? '/admin' : '/');
    }
    catch (error){
        throw error.response?.data?.message || 'Login failed';
    }
 }
 const signup = async (userData) =>{
    try{
        const data = await authService.signup(userData);
        localStorage.setItem('token', data.token);
        setUser(data.data?.user || data.user);
        router.push('/');

    }catch(error){
        throw error.response?.data?.message || 'Registration failed';
    }
 }
 const logout = async () =>{
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
 }
 return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};