import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Update this with your actual API URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;