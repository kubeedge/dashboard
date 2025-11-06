import Axios from 'axios';

export const request = Axios.create({
  baseURL: '/api',
});

request.interceptors.request.use((config) => {
  if (config?.headers?.Authorization) {
    return config;
  }

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  }
  return config;
});
