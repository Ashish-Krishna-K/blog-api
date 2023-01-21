import axios from "axios";
import { format, parseISO } from "date-fns";

const baseUrl = 'https://blog-api-u2hp.onrender.com';

const getAuthTokenFromLocalStorage = () => {
  const token = localStorage.getItem('AUTH_TOKEN');
  return token || null;
}

const saveAuthTokenToLocalStorage = (token) => {
  const newToken = 'Bearer ' + token;
  localStorage.setItem('AUTH_TOKEN', newToken);
  return newToken;
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

const formatDates = (serverDate) => {
  if (!serverDate) return;
  return format(parseISO(serverDate), 'PPPp')
}

export {
  clientAxios,
  cmsAxios,
  getAuthTokenFromLocalStorage,
  saveAuthTokenToLocalStorage,
  formatDates
}