import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_BASE_URL||'http://localhost:8080/api',headers:{'Content-Type':'application/json'}});
api.interceptors.request.use(c=>{const t=sessionStorage.getItem('elm_token');if(t)c.headers.Authorization=`Bearer ${t}`;return c;});
api.interceptors.response.use(r=>r,e=>Promise.reject(new Error(e?.response?.data?.message||e?.response?.data?.error||e.message||'Something went wrong.')));
export default api;
