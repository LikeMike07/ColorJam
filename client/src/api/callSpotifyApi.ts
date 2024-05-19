import axios, { AxiosError } from "axios";

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
        else if (response.status >= 400) new Error(response.statusText);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;

            if (axiosError.response?.status === 401) {
                try {
                    console.log('Refreshing token', localStorage.getItem('spotify_refresh_token'));
                    const refreshResponse = await axiosInstance.post(`${BE_BASE_URL}/auth/refresh`, {refresh_token: refresh_token});
                    localStorage.setItem('spotify_access_token', refreshResponse.data.access_token);
                    return callSpotifyApi(endpoint, options);

                } catch (error) {
                    throw console.error('Failed to refresh token', error);
                }
                
            } else {
                throw new Error(axiosError.message);
            }

        } else {
            throw new Error('Failed to make request');
        }
    }
    
}