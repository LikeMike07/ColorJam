import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import callSpotifyApi from "../../api/callSpotifyApi";
import { useCookies } from "react-cookie";
import { User, Colors } from "types"
import { useAudio } from "../../@contexts";
import { useColors, useUpdateColor } from "./hooks";
import axios from "axios";

export default function Dashboard() {
    const queryClient = useQueryClient();
    const [cookies, setCookie] = useCookies(['spotify_access_token', 'spotify_refresh_token']);
    const user = queryClient.getQueryData<User>(['user']);

    const [selectedTab, setSelectedTab] = React.useState<'artists' | 'tracks'>('artists');

    const audio = useAudio();

    const topArtists = useQuery({
        queryKey: ['top-artists'],
        queryFn: async () => {
            return callSpotifyApi('/user/top-artists', { method: 'GET', params: { access_token: cookies['spotify_access_token'] } });
        }
    });

    const topTracks = useQuery({
        queryKey: ['top-tracks'],
        queryFn: async () => {
            return callSpotifyApi('/user/top-tracks', { method: 'GET', params: { access_token: cookies['spotify_access_token'] } });
        }
    });

    const { data: colors } = useColors(user?.images[1].url)

    const { mutate: getColorPalette } = useUpdateColor();

    if (!user) return <div>Loading...</div>;


    return (
        <div className="w-full flex flex-col gap-5 mt-8">
            <div className="absolute right-0 top-0 w-40 h-screen flex flex-col ">
                {colors
                    ? Object.keys(colors).map((color) => (
                        <div key={color} className="w-full h-full" style={{ backgroundColor: `rgb(${colors[color as keyof Colors].rgb[0]},${colors[color as keyof Colors].rgb[1]},${colors[color as keyof Colors].rgb[2]})` }}></div>
                    )) : <div>Loading...</div>}
            </div>
            <div className="w-full max-w-4xl mx-auto bg-neutral-200 rounded-3xl p-5">
                <div className="flex items-center gap-2">
                    <img src={user.images[1].url} alt="User profile" className="h-14 w-14 object-cover rounded-full" />
                    <h1>{user.display_name}</h1>
                </div>
            </div>
            <div className="w-full flex max-w-4xl mx-auto bg-neutral-200 rounded-full overflow-clip">
                <button className={`p-2 w-full ${selectedTab === 'artists' ? 'rounded-3xl' : 'bg-neutral-300'}`} onClick={() => setSelectedTab('artists')}>Artists</button>
                <button className={`p-2 w-full ${selectedTab === 'tracks' ? 'rounded-3xl' : 'bg-neutral-300'}`} onClick={() => setSelectedTab('tracks')}>Tracks</button>
            </div>
            <div className="w-full max-w-4xl mx-auto bg-neutral-200 rounded-3xl pb-5 overflow-clip">
                <div className="grid grid-cols-8 items-center justify-center gap-2 p-5">
                    {selectedTab === 'artists' && (topArtists.isLoading || !topArtists
                        ? Array.from({ length: 24 }).map((_, index) => (
                            <div key={index} className="flex items-center justify-center gap-2">
                                <div className="h-full w-full aspect-square bg-neutral-300 animate-pulse rounded-full"></div>
                            </div>
                        ))
                        : topArtists.data.map((artist: any) => (
                            <div onMouseEnter={() => {
                                audio.play(artist.topSong.preview_url);
                                getColorPalette(artist.images[1].url);
                            }} onMouseLeave={() => audio.stop()} key={artist.id} className="flex items-center justify-center gap-2">
                                <img src={artist.images[1].url} alt="Artist profile" className="h-full w-full aspect-square object-cover rounded-full" />
                            </div>
                        ))
                    )}
                    {selectedTab === 'tracks' && (topTracks.isLoading || !topTracks
                        ? <div>Loading...</div>
                        : topTracks.data.items.map((track: any) => (
                            <div key={track.id}
                                onMouseEnter={() => {
                                    audio.play(track.preview_url);
                                    getColorPalette(track.album.images[1].url);
                                }}
                                onMouseLeave={() => audio.stop()}
                                className="flex items-center justify-center gap-2">
                                <img src={track.album.images[1].url} alt="Artist profile" className="h-full w-full aspect-square object-cover rounded-full" />
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}

