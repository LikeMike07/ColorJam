import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import callSpotifyApi from "../../api/callSpotifyApi";
import { useCookies } from "react-cookie";
import { User, Colors, ColorNames } from "types";
import { useAudio } from "../../@contexts";
import { useColors, useUpdateColor } from "./hooks";
import axios from "axios";
import Header from "./components/Header/Header";
import { GradientCanvas } from "../../components/GradientCanvas";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import ArtistList from "./components/ArtistList/ArtistList";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [cookies, setCookie] = useCookies([
    "spotify_access_token",
    "spotify_refresh_token",
  ]);
  const user = queryClient.getQueryData<User>(["user"]);
  const colors = queryClient.getQueryData<Colors>(["colors"]);

  const [selectedTab, setSelectedTab] = React.useState<"artists" | "tracks">(
    "artists"
  );

  const audio = useAudio();

  const { data: topArtists, isLoading: isTopArtistsLoading } = useQuery({
    queryKey: ["top-artists"],
    queryFn: async (): Promise<Array<Artist>> => {
      return callSpotifyApi("/user/top-artists", {
        method: "GET",
        params: { access_token: cookies["spotify_access_token"] },
      });
    },
  });

//   const {data: topTracks, isLoading} = useQuery({
//     queryKey: ["top-tracks"],
//     queryFn: async () => {
//       return callSpotifyApi("/user/top-tracks", {
//         method: "GET",
//         params: { access_token: cookies["spotify_access_token"] },
//       });
//     },
//   });


  const { mutate: getColorPalette } = useUpdateColor();

  
  if (!user) return <div>Loading...</div>;

  

  return (
    <div className="w-full flex flex-col gap-5 ">
      <div className="absolute right-0 bottom-0 w-40 h-20 grid grid-cols-6 z-20">
        {colors
          ? Object.keys(colors).map((color) => (
              <div
                className="w-full h-full"
                style={{ backgroundColor: colors[color as ColorNames].hex }}
              ></div>
            ))
          : null}
      </div>
      
        <GradientCanvas
          colors={{
            1: user.colors["Vibrant"].hex,
            2: user.colors["LightVibrant"].hex,
            3: user.colors["DarkVibrant"].hex,
            4: user.colors["LightMuted"].hex,
          }}
        />
        <div className="relative flex flex-col items-center mt-10 w-full gap-5 text-white">
        <Header />
        <div className="w-full max-w-4xl">
            <TabGroup>
                <TabList className={'w-full flex justify-around bg-black/40  rounded-full overflow-clip'}>
                    <Tab className={'data-[selected]:bg-white/20 w-full p-3'}>Top Artists</Tab>
                    <Tab className={' data-[selected]:bg-white/20 w-full p-3'}>Top Tracks</Tab>
                </TabList>
                <TabPanels className={'mt-5'}>
                    <TabPanel>
                        <ArtistList artists={topArtists} isLoading={isTopArtistsLoading} getColorPalette={getColorPalette}/>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
        {/* <div className="w-full flex mx-auto rounded-full overflow-clip max-w-4xl backdrop-blur-lg">
          <button
            className={`p-2 w-full ${
              selectedTab === "artists" ? "rounded-3xl" : "bg-neutral-300"
            }`}
            onClick={() => setSelectedTab("artists")}
          >
            Artists
          </button>
          <button
            className={`p-2 w-full ${
              selectedTab === "tracks" ? "rounded-3xl" : "bg-neutral-300"
            }`}
            onClick={() => setSelectedTab("tracks")}
          >
            Tracks
          </button>
        </div>
        <div className="w-full rounded-3xl pb-5 max-w-4xl">
          <div className="grid grid-cols-8 items-center justify-center gap-2 p-5 bg-black/40 rounded-3xl backdrop-blur-lg">
            {selectedTab === "artists" &&
              (topArtistIsLoading || !topArtists
                ? Array.from({ length: 24 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center gap-2"
                    >
                      <div className="h-full w-full aspect-square bg-neutral-300 animate-pulse rounded-full"></div>
                    </div>
                  ))
                : topArtists.map((artist) => (
                    <div
                      onMouseEnter={() => {
                        audio.play(artist.topSong.preview_url ?? "");
                        getColorPalette(artist.images[1].url);
                      }}
                      onMouseLeave={() => audio.stop()}
                      key={artist.id}
                      className="flex items-center justify-center gap-2"
                    >
                      <img
                        src={artist.images[1].url}
                        alt="Artist profile"
                        className="h-full w-full aspect-square object-cover rounded-full"
                      />
                    </div>
                  )))}
            {selectedTab === "tracks" &&
              (topTracks.isLoading || !topTracks ? (
                <div>Loading...</div>
              ) : (
                topTracks.data.items.map((track: any) => (
                  <div
                    key={track.id}
                    onMouseEnter={() => {
                      audio.play(track.preview_url);
                      getColorPalette(track.album.images[1].url);
                    }}
                    onMouseLeave={() => audio.stop()}
                    className="flex items-center justify-center gap-2"
                  >
                    <img
                      src={track.album.images[1].url}
                      alt="Artist profile"
                      className="h-full w-full aspect-square object-cover rounded-full"
                    />
                  </div>
                ))
              ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
