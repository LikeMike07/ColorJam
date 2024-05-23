import axios, { Axios, AxiosError, AxiosRequestConfig } from "axios";
import { Cookies } from "react-cookie";

interface RequestOptions extends AxiosRequestConfig {}

const BE_BASE_URL = process.env.BE_BASE_URL || 'http://localhost:3005';

export default async function callSpotifyApi(endpoint: string, options?: RequestOptions) {
    const cookies =  new Cookies();
    const access_token = cookies.get('spotify_access_token');
    const refresh_token = cookies.get('spotify_refresh_token');
    
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
                    console.log('Refreshing token...');
                    const refreshResponse = await axiosInstance.post(`${BE_BASE_URL}/auth/refresh`, {refresh_token: refresh_token});
                    cookies.set('spotify_access_token', refreshResponse.data.access_token, {maxAge: refreshResponse.data.expires_in * 1000});
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