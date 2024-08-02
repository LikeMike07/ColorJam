import { GradientCanvas } from '../../components';
import { color, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Colors } from 'types';
import { Gradient } from '../../components/GradientCanvas/Gradient';

interface Props {
    pallete: Colors;
    onAnimationComplete?: () => void;
    zIndex: number;
}

const CircleAnimation = ({ pallete, onAnimationComplete, zIndex }: Props) => {
    const [isMounted, setIsMounted] = useState(false);

    const uniqueId = `my-canvas-${pallete.LightVibrant.hex.slice(1)}-${zIndex}`;
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && pallete) {
            const newGradient = new Gradient();
            newGradient?.initGradient(`#${uniqueId}`);
        }
    }, [isMounted, pallete]);

    return (
        <>
            <motion.div
                initial={{ scaleX: 0, scaleY: 0, opacity: 1, borderRadius: '100%' }}
                animate={{
                    scaleX: 3.2,
                    scaleY: 3.2,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 4, type: 'spring' }}
                style={{
                    backgroundColor: pallete.DarkVibrant.hex,
                    zIndex,
                }}
                className="absolute max-w-screen h-screen aspect-square overflow-hidden mx-auto left-1/2 -translate-x-1/2 "
            ></motion.div>
            <motion.div
                initial={{ scaleX: 0, scaleY: 0, opacity: 1, borderRadius: '100%' }}
                animate={{
                    scaleX: 2.4,
                    scaleY: 2.4,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3.5, type: 'spring', delay: 0.5 }}
                style={{
                    backgroundColor: pallete.LightVibrant.hex,
                    zIndex,
                }}
                className="absolute max-w-screen h-screen aspect-square overflow-hidden mx-auto left-1/2 -translate-x-1/2 "
            ></motion.div>
            <motion.div
                initial={{ scaleX: 0, scaleY: 0, opacity: 1, borderRadius: '100%' }}
                animate={{
                    scaleX: 1.7,
                    scaleY: 1.7,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3, type: 'spring', delay: 0.7 }}
                style={{
                    backgroundColor: pallete.Vibrant.hex,
                    zIndex,
                }}
                className="absolute max-w-screen h-screen aspect-square overflow-hidden mx-auto left-1/2 -translate-x-1/2 "
            ></motion.div>
            <motion.div
                initial={{ scaleX: 0, scaleY: 0, opacity: 1, borderRadius: '100%' }}
                animate={{
                    scaleX: 1,
                    scaleY: 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, type: 'spring', delay: 0.9 }}
                style={{
                    backgroundColor: pallete.DarkMuted.hex,
                    zIndex,
                }}
                className="absolute max-w-screen h-screen aspect-square overflow-hidden mx-auto left-1/2 -translate-x-1/2 "
            ></motion.div>
            <motion.div
                initial={{ scaleX: 0, scaleY: 0, opacity: 1, borderRadius: '100%' }}
                animate={{
                    scaleX: 0.7,
                    scaleY: 0.7,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, type: 'spring', delay: 1.1 }}
                style={{
                    backgroundColor: pallete.Muted.hex,
                    zIndex,
                }}
                className="absolute max-w-screen h-screen aspect-square overflow-hidden mx-auto left-1/2 -translate-x-1/2 "
            ></motion.div>
            <motion.div
                initial={{ scaleX: 0, scaleY: 0, opacity: 1, borderRadius: '100%' }}
                animate={{
                    scaleX: 0.4,
                    scaleY: 0.4,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, type: 'spring', delay: 1.3 }}
                style={{
                    backgroundColor: pallete.LightMuted.hex,
                    zIndex,
                }}
                className="absolute max-w-screen h-screen aspect-square overflow-hidden mx-auto left-1/2 -translate-x-1/2 "
            ></motion.div>
        </>
    );
};

export default CircleAnimation;

// {/* <GradientCanvas colours={pallete} /> */}
//             {/* <canvas
//                 id={`${uniqueId}`}
//                 className={'w-screen h-screen'}
//                 data-transition-in={false}
//                 data-js-darken-top={false}
//                 style={
//                     {
//                         '--gradient-color-1': `${pallete['Vibrant'].hex}`,
//                         '--gradient-color-2': `${pallete['LightVibrant'].hex}`,
//                         '--gradient-color-3': `${pallete['DarkVibrant'].hex}`,
//                         '--gradient-color-4': `${pallete['LightMuted'].hex}`,
//                     } as React.CSSProperties
//                 }
//             /> */}
