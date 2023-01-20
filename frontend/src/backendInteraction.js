import axios from "axios";

const baseUrl = 'https://blog-api-u2hp.onrender.com';

const getAuthTokenFromLocalStorage = () => {
  const token = localStorage.getItem('AUTH_TOKEN');
  return token ? JSON.stringify(token) : null;
}

const saveAuthTokenToLocalStorage = (token) => {
  const newToken = 'Bearer ' + token;
  const jsonToken = JSON.stringify(newToken);
  localStorage.setItem('AUTH_TOKEN', jsonToken);
  return jsonToken;
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