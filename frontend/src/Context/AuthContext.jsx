//login state, user info

'use client';

import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService' ;

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
        const data = await authService.getProfile();
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

 const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.data?.user || data.user);
      router.push('/');
    }
    catch (error){
        throw error.message?.data?.message || 'Login failed ';
    }
 }
 const signup = async (userData) =>{
    try{
        const data = await authService.signup(userData);
        localStorage.setItem('token', data.token);
        setUser(data.data?.user || data.user);
        router.push('/');

    }catch(error){
        throw error.message?.data?.message || 'Registration failed';
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