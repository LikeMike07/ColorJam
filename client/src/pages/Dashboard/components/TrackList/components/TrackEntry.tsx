import { useUpdateColor } from '../../../../Dashboard/hooks';
import { useAudio } from '../../../../../@contexts/Audio';
import React, { ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactDOM from 'react-dom';
import { Colors } from 'types';
import { useGradient } from '../../../../../@contexts/Gradient';

interface Props {
    track: Track;
}

export default function TrackEntry({ track }: Props) {
    const audio = useAudio();
    const { data: pallete, mutate: getPallete } = useUpdateColor();
    const gradient = useGradient();

    useEffect(() => {
        if (pallete) gradient.addPallete(pallete);
    }, [pallete]);

    return (
        <div
            onMouseEnter={() => {
                if (track.preview_url) audio.play(track.preview_url);
                if (!pallete) getPallete(track.album.images[0].url);
                else gradient.addPallete(pallete);
            }}
            onMouseLeave={() => {
                audio.stop();
            }}
            key={track.id}
            className="flex items-center justify-center gap-2"
        >
            <img
                src={track.album.images[1].url}
                alt="Artist profile"
                className="h-full w-full aspect-square object-cover rounded-full"
            />
            {/* {pallete
                ? document.getElementById('colors') &&
                  ReactDOM.createPortal(
                      <motion.div
                          initial={{
                              scaleX: 0,
                              scaleY: 0,
                          }}
                          animate={{
                              scaleX: 2.5,
                              scaleY: 2,
                          }}
                          transition={{ duration: 1 }}
                          className="absolute max-w-screen h-screen flex flex-col aspect-square rounded-full overflow-clip"
                      >
                          {Object.keys(pallete).map((color) => (
                              <div
                                  className="h-full w-full"
                                  style={{
                                      backgroundColor:
                                          pallete[color as keyof Colors].hex,
                                  }}
                              ></div>
                          ))}
                      </motion.div>,
                      document.getElementById('colors') as Element
                  )
                : null} */}
        </div>
    );
}
