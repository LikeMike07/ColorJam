import { useQuery } from "@tanstack/react-query";
import React from "react";
import callSpotifyApi from "../../api/callSpotifyApi";
import { useCookies } from "react-cookie";

export default function Dashboard() {
    const [cookies, setCookie] = useCookies(['spotify_access_token', 'spotify_refresh_token']);

    const { data } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            return callSpotifyApi('/user', {method: 'GET', body: {access_token: cookies['spotify_access_token']} });
        }
    });

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}