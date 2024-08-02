import React, { useState, useEffect } from 'react';
import { Gradient } from './Gradient';
import { useQueryClient } from '@tanstack/react-query';
import { Colors } from 'types';
import styles from './GradientCanvas.module.css';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    colours: Colors;
    isDarkenTop?: boolean;
    isDataTransitionIn?: boolean;
}

export default function GradientCanvas({
    colours,
    isDarkenTop = false,
    isDataTransitionIn = true,
}: Props) {
    // const queryClient = useQueryClient();
    // const colours = queryClient.getQueryData<Colors>(['colors']);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && colours) {
            const newGradient = new Gradient();
            // newGradient?.initGradient(colours.LightVibrant.hex);
        }
    }, [isMounted, colours]);

    if (!colours) return <></>;

    return (
        <canvas
            id={colours.LightVibrant.hex.slice(1)}
            className={''}
            data-transition-in={isDataTransitionIn ? '' : null}
            data-js-darken-top={isDarkenTop ? '' : null}
            style={
                {
                    '--gradient-color-1': `${colours['Vibrant'].hex}`,
                    '--gradient-color-2': `${colours['LightVibrant'].hex}`,
                    '--gradient-color-3': `${colours['DarkVibrant'].hex}`,
                    '--gradient-color-4': `${colours['LightMuted'].hex}`,
                } as React.CSSProperties
            }
        />
    );
}
