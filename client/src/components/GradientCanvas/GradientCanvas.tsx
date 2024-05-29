import React, {useState, useEffect} from "react";
import { Gradient } from "./Gradient";
import { useQueryClient } from "@tanstack/react-query";
import { Colors } from "types";
import styles from "./GradientCanvas.module.css"

interface Props {
    colors: {
        1: string;
        2: string;
        3: string;
        4: string;
    }
    isDarkenTop?: boolean;
    isDataTransitionIn?: boolean;
}

export default function GradientCanvas({colors, isDarkenTop = false, isDataTransitionIn = true}: Props) {

    const queryClient = useQueryClient();
    const colours = queryClient.getQueryData<Colors>(['colors']);

    const [isMounted, setIsMounted] = useState(false);
    const [gradient, setGradient] = useState<Gradient | null>(null);
    

    useEffect(() => {
        setIsMounted(true);
    }, []);


    useEffect(() => {
        if (isMounted && colours) {
            if (gradient) {
                gradient?.destroy();
            } 
            const newGradient = new Gradient();
            newGradient?.initGradient("#gradient-canvas");
            setGradient(newGradient);
        }
    }, [isMounted, colours]);

    if (!colours) return <div>Loading...</div>;

    return (
            <canvas
                id="gradient-canvas"
                className={"w-full h-screen fixed top-0 left-0 z-0 "}
                data-transition-in={isDataTransitionIn ? "" : null}
                data-js-darken-top={isDarkenTop ? "" : null}
                style={{
                    "--gradient-color-1": `${colours['Vibrant'].hex}`,
                    "--gradient-color-2": `${colours['LightVibrant'].hex}`,
                    "--gradient-color-3": `${colours['DarkVibrant'].hex}`,
                    "--gradient-color-4": `${colours['LightMuted'].hex}`,
                } as React.CSSProperties}
            />
        );

}