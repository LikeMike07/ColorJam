import React from "react";
import { useAudio } from "../../../../@contexts";

interface Props {
  artists: Array<Artist> | undefined;
  isLoading: boolean;
  getColorPalette: (url: string) => void;
}

export default function ArtistList({
  artists,
  getColorPalette,
  isLoading,
}: Props) {
  const audio = useAudio();

  return (
    <div className="grid grid-cols-8 gap-2 p-4 bg-black/40 rounded-3xl backdrop-blur-lg">
      {isLoading || !artists
        ? Array.from({ length: 24 }).map((_, index) => (
            <div key={index} className="flex items-center justify-center gap-2">
              <div className="h-full w-full aspect-square bg-neutral-300 animate-pulse rounded-full"></div>
            </div>
          ))
        : artists.map((artist) => (
            <div
              onMouseEnter={() => {
                if (artist.topSong?.preview_url)
                  console.log(artist.topSong.preview_url);
                getColorPalette(artist.images[1].url);
              }}
              onMouseLeave={() => {
                if (audio.isPlaying) audio.stop();
              }}
              key={artist.id}
              className="flex items-center justify-center gap-2"
            >
              <img
                src={artist.images[1].url}
                alt="Artist profile"
                className="h-full w-full aspect-square object-cover rounded-full"
              />
            </div>
          ))}
    </div>
  );
}
