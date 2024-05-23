import React, { createContext, useState, useRef, useEffect } from 'react';

export const AudioContext = createContext({
	play: (src: string): void => undefined,
	pauseAudio: (): void => undefined,
	isPlaying: false,
	setVolume: (volume: number): void => undefined,
	setSource: (src: string): void => undefined,
	stop: (): void => undefined,
});


interface Props {
	children: React.ReactNode;
}

export default function AudioProvider({ children }: Props) {
	const audioRef = useRef<HTMLAudioElement>();
	const playPromise = useRef<Promise<void>>();
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		audioRef.current = new Audio();

		audioRef.current.addEventListener('loadeddata', () => {
			audioRef.current?.play();
		});

		audioRef.current.addEventListener('ended', () => {
			setIsPlaying(false);
		});

		return () => {
			audioRef.current?.removeEventListener('ended', () => {
				setIsPlaying(false);
			});
		};
	}, [audioRef]);

	// If you want to make this better - move src to state and if it is unchanged, pause and set currentTime to 0 instead of setting src
	function playAudio(src: string) {
		// https://developer.chrome.com/blog/play-request-was-interrupted
		// TL;DR - when you play(), you should wait for the promise to resolve before you can set the src again
		if (playPromise.current !== undefined) {
			playPromise.current.then(() => {
				if (!audioRef.current) throw new Error('Cannot play audio - no audio player created');

				audioRef.current.src = src;
				audioRef.current.load();

			});
		} else {
			if (!audioRef.current) throw new Error('Cannot play audio - no audio player created');
			audioRef.current.src = src;
			audioRef.current.load();
		}
	}

	function pauseAudio() {
		if (!audioRef.current?.src) throw new Error('Cannot pause audio - no audio source set');
		if (!isPlaying) throw new Error('Cannot pause audio - audio is not playing');

		audioRef.current.pause();
		setIsPlaying(false);
	}

	function setVolume(volume: number) {
		if (volume < 0 || volume > 1) throw new Error('Volume must be between 0 and 1');
		if (!audioRef.current) throw new Error('Cannot set volume - no audio source set');

		audioRef.current.volume = volume;
	}

	function setSource(src: string) {
		if (!audioRef.current) throw new Error('Cannot set source - no audio source set');

		audioRef.current.src = src;
	}

	function stopAudio() {
		if (!audioRef.current?.src) throw new Error('Cannot stop audio - no audio source set');

		audioRef.current.pause();
		audioRef.current.currentTime = 0;
		audioRef.current.src = '';

	}

	const value = {
		play: playAudio,
		pauseAudio,
		isPlaying,
		setVolume,
		setSource,
		stop: stopAudio,
		audio: audioRef.current,
	};

	return (
		<AudioContext.Provider value={value}>
			{children}
		</AudioContext.Provider>
	);
}

export function useAudio() {
	return React.useContext(AudioContext);
}