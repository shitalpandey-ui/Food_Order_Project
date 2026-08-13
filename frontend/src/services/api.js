// centralized api setup

import axios from 'axios';
// import qs fron 'qs';

const api = axios.create({
     baseURL: '/api',     // the api will be written automatically in the url
     withCredentials: true,
    //  paramSerializer : param => qs.stingify(params, {arrayFormat: 'repeat'}),  //(handles query strings properly)
})
 

const API_Base = 'http://localhost:8000';

export const getRestaurants = async () => {
    const res = await fetch(`${API_BASE}/restaurants`);
    return res.json();
    
};

export const getRestaurantById = async (id) => {
    const res = await fetch (`${API_BASE}/restaurants/${id}`);
    return res.json();
    
};
export const placeOrder = async (orderData) => {
    const res = await fetch (`${API_BASE}/restaurants/orders`,{
    method: 'POST',
    headers:{
        'Content-Type': 'application/json',
    },
    body:  JSON.stringify(orderData),
 
});
return res.json;
}

   export default api;