import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import callSpotifyApi from '../../api/callSpotifyApi';
import { useCookies } from 'react-cookie';
import { User, Colors, ColorNames } from 'types';
import { useAudio, useGradient } from '../../@contexts';
import { useColors, useUpdateColor } from './hooks';
import axios from 'axios';
import Header from './components/Header/Header';
import { GradientCanvas } from '../../components/GradientCanvas';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/react';
import { ArtistList, TrackList } from './components';

export default function Dashboard() {
    const queryClient = useQueryClient();
    const [cookies, setCookie] = useCookies(['spotify_access_token', 'spotify_refresh_token']);
    const user = queryClient.getQueryData<User>(['user']);
    const colors = queryClient.getQueryData<Colors>(['colors']);

    const [selectedTab, setSelectedTab] = React.useState<'artists' | 'tracks'>('artists');

    const audio = useAudio();
    const gradient = useGradient();

    const { data: topArtists, isLoading: isTopArtistsLoading } = useQuery({
        queryKey: ['top-artists'],
        queryFn: async (): Promise<Array<Artist>> => {
            return callSpotifyApi('/user/top-artists', {
                method: 'GET',
                params: { access_token: cookies['spotify_access_token'] },
            });
        },
    });

    const { data: topTracks, isLoading } = useQuery({
        queryKey: ['top-tracks'],
        queryFn: async (): Promise<Array<Track>> => {
            return callSpotifyApi('/user/top-tracks', {
                method: 'GET',
                params: { access_token: cookies['spotify_access_token'] },
            });
        },
    });

    const { mutate: getColorPalette } = useUpdateColor();

    useEffect(() => {
        if (user) gradient.addPallete(user.colors);
    }, [user]);

    if (!user) return <div>Loading...</div>;

    return (
        <>
            <div className="w-full flex flex-col gap-5 z-20">
                <div className="absolute right-0 bottom-0 w-40 h-20 grid grid-cols-6 "></div>

                <div className="relative flex flex-col items-center mt-10 w-full gap-5 text-white">
                    <Header />
                    <div className="w-full max-w-4xl">
                        <TabGroup>
                            <TabList className={'w-full flex justify-around bg-black/40 backdrop-blur-lg rounded-full overflow-clip'}>
                                <Tab className={'data-[selected]:bg-white/20 w-full p-3 focus:outline-none'}>Top Artists</Tab>
                                <Tab className={' data-[selected]:bg-white/20 w-full p-3 focus:outline-none'}>Top Tracks</Tab>
                            </TabList>
                            <TabPanels className={'mt-5 focus:outline-none'}>
                                <TabPanel>
                                    <ArtistList artists={topArtists} isLoading={isTopArtistsLoading} getColorPalette={getColorPalette} />
                                </TabPanel>
                                <TabPanel>
                                    <TrackList tracks={topTracks} isLoading={isLoading} getColorPalette={getColorPalette} />
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </div>
                </div>
            </div>
        </>
    );
}
