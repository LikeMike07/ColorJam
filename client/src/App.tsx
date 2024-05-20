import React, { useEffect } from "react";
import callSpotifyApi from "./api/callSpotifyApi";
import { Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { Login, Dashboard } from "./pages";

export default function App(){
    const [cookies, setCookie] = useCookies(['spotify_access_token', 'spotify_refresh_token']);
    const navigate = useNavigate();

    useEffect(() => {
        if (!cookies.spotify_access_token) {
            navigate('/login');
        }
    }, [cookies]);

    return (
        <div>
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/" element={<Dashboard/>} />
            </Routes>
        </div>
    )
}