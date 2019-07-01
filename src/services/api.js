import axios from 'axios';

const api = axios.create({
    //baseURL: 'https://rroweek-backend.herokuapp.com'
    baseURL: 'http://localhost:3333'
});

export default api;