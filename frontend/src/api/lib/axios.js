import axios from "axios";

const Axios =  axios.create({
  baseURL:"http://localhost:5000/api/v1",
  headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
})

Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default Axios