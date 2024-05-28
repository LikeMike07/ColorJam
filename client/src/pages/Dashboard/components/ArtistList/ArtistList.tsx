import React from "react";
import { useAudio } from "@contexts";

interface Props {
    artists: Array<Artist>;
    getColorPalette: (url: string) => void;
}

export default function ArtistList({artists, getColorPalette}: Props) {
    const audio = useAudio();

    return (
        artists.map((artist) => (
            <div onMouseEnter={() => {
                audio.play(artist.topSong.preview_url ?? '');
                getColorPalette(artist.images[1].url);
            }} onMouseLeave={() => audio.stop()} key={artist.id} className="flex items-center justify-center gap-2">
                <img src={artist.images[1].url} alt="Artist profile" className="h-full w-full aspect-square object-cover rounded-full" />
            </div>
        ))
    )
}