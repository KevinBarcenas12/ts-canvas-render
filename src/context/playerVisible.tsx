import { createContext, useContext, useState } from 'react';
import type { ContextHook, Action } from './types';

const ContextProvider = createContext<boolean>(false);
const ContextUpdater = createContext<Action<boolean>>(() => false);

export function usePlayerVisible(): ContextHook<boolean> {
    return [
        useContext(ContextProvider),
        useContext(ContextUpdater),
    ];
}

export default function PlayerVisibleProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<boolean>(false);

    return (
        <ContextProvider.Provider value={state}>
            <ContextUpdater.Provider value={setState}>
                {children}
            </ContextUpdater.Provider>
        </ContextProvider.Provider>
    );
}
