import { AnimatePresence, motion } from 'framer-motion';
import { useUpdateColor } from '../../pages/Dashboard/hooks';
import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { ColorNames, Colors } from 'types';
import CircleAnimation from './CircleAnimation';
import ReactDOM from 'react-dom/client';

type GradientContextType = {
    addPallete: (colors: Colors) => void;
};

export const GradientContext = createContext<GradientContextType>({
    addPallete: (colors: Colors): void => undefined,
});

interface Props {
    children: ReactNode;
}

export default function GradientProvider({ children }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    function addPallete(colors: Colors) {
        const container = containerRef.current;
        if (container) {
            const zIndex = container.children.length;
            const div = document.createElement('div');
            container.appendChild(div);
            // console.log(container);
            const root = ReactDOM.createRoot(div);
            root.render(<CircleAnimation pallete={colors} zIndex={zIndex} />);
        }
    }

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const observer = new MutationObserver(() => {
                while (container.children.length > 10) {
                    container.firstChild &&
                        container.removeChild(container.firstChild);
                }
            });

            observer.observe(container, { childList: true });

            return () => observer.disconnect();
        }
    }, []);

    const value = {
        addPallete,
    };

    return (
        <GradientContext.Provider value={value}>
            <div
                className="-z-10 h-screen w-screen overflow-hidden "
                ref={containerRef}
                style={{ position: 'absolute', width: '100%' }}
            >
                <AnimatePresence />
            </div>
            {children}
        </GradientContext.Provider>
    );
}

export function useGradient() {
    return useContext(GradientContext);
}
