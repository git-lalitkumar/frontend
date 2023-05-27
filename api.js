import axios from 'axios';

const api = axios.create({ baseURL: 'https://dev.abdimant.com/monorepo-backend/public/api' });

export default api;
