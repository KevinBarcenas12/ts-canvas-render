import { createContext, useContext, useState } from 'react';
import type { ContextHook, Action } from './types';

const ContextProvider = createContext<string>('');
const ContextUpdater = createContext<Action<string>>(() => '');

export function useModal(): ContextHook<string> {
    return [
        useContext(ContextProvider),
        useContext(ContextUpdater),
    ];
}

export default function ModalProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [state, setState] = useState<string>('');

    return (
        <ContextProvider.Provider value={state}>
            <ContextUpdater.Provider value={setState}>
                {children}
            </ContextUpdater.Provider>
        </ContextProvider.Provider>
    );
}
