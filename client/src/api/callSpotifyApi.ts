import axios from "axios";

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: Record<string, any>;
}

const BE_BASE_URL = process.env.BE_BASE_URL || 'http://localhost:3005';

export default async function callSpotifyApi(endpoint: string, options: RequestOptions) {
    const refresh_token = localStorage.getItem('spotify_refresh_token');
    const access_token = localStorage.getItem('spotify_access_token');

    const axiosInstance = axios.create({
        baseURL: BE_BASE_URL,
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        }
    });

    try {
        const response = await axiosInstance.request({url: endpoint, ...options})
        if (response.status >= 200 && response.status < 300) return response.data;
        else throw new Error(response.statusText);
    } catch (error) {
        console.error(error);
    }
    
}