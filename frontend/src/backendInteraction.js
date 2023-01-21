import axios from "axios";

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

export {
  clientAxios,
  cmsAxios,
  getAuthTokenFromLocalStorage,
  saveAuthTokenToLocalStorage
}