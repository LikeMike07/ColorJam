import React, { useEffect } from 'react';
import callSpotifyApi from './api/callSpotifyApi';
import { Route, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
import { Login, Dashboard } from './pages';
import { useQuery } from '@tanstack/react-query';

export default function App() {
    const [cookies, setCookie] = useCookies([
        'spotify_access_token',
        'spotify_refresh_token',
    ]);

    const { data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            return callSpotifyApi('/user', {
                method: 'GET',
                params: { access_token: cookies['spotify_access_token'] },
            });
        },
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies['spotify_refresh_token']) {
            navigate('/login');
        }
    }, [cookies, navigate]);

    return (
        <div>
            <div id="colors" className="flex justify-center"></div>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </div>
    );
}
