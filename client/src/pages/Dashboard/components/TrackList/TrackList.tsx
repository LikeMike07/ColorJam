import React from 'react';
import { useAudio, useGradient } from '../../../../@contexts';
import TrackEntry from './components/TrackEntry';

interface Props {
    tracks: Array<Track> | undefined;
    isLoading: boolean;
    getColorPalette: (url: string) => void;
}

export default function TrackList({
    tracks,
    getColorPalette,
    isLoading,
}: Props) {
    const audio = useAudio();
    const gradient = useGradient();

    return (
        <div className="grid grid-cols-8 gap-2 p-4 bg-black/40 rounded-3xl backdrop-blur-lg">
            {isLoading || !tracks
                ? Array.from({ length: 24 }).map((_, index) => (
                      <div
                          key={index}
                          className="flex items-center justify-center gap-2"
                      >
                          <div className="h-full w-full aspect-square bg-neutral-300 animate-pulse rounded-full"></div>
                      </div>
                  ))
                : tracks.map((track) => (
                      <TrackEntry key={track.id} track={track} />
                  ))}
        </div>
    );
}
