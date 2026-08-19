//login, register, logout
import api from './api'


export const authService = {
    login: async (credentials) =>{
        const response = await api.post("/auth/login",credentials);
        return response.data; // {expected: Token,user}
    },
    signup: async(userData) =>{
       const response = await api.post("/auth/signup",userData);
       return response.data;  // {expected: Token,user}
    },
    getprofile: async()=>{
        const response = await api.get("/auth/me");
        return response.data;    // {expected: user}
    },

};