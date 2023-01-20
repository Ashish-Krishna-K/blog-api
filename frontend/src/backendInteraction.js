import axios from "axios";

const baseUrl = 'https://blog-api-u2hp.onrender.com';

const getAuthTokenFromLocalStorage = () => {
  return JSON.stringify(localStorage.getItem('AUTH_TOKEN'));
}

const clientAxios = axios.create({
  baseURL: 'https://blog-api-u2hp.onrender.com',
})

const cmsAxios = axios.create({
  baseURL: 'https://blog-api-u2hp.onrender.com',
  headers: {
    'authorization': getAuthTokenFromLocalStorage()
  }
})

export {
  clientAxios,
  cmsAxios
}