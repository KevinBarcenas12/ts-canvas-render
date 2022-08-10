import { createContext, useContext, useEffect, useState } from 'react';
import type { FileObject } from 'util/global';
import type { ContextHook, Action } from './types';

type Files = {
    index: number;
    list: FileObject[];
    isValidFiles(): boolean;
    getValidFiles: () => FileObject[];
};
const Default: Files = {
    index: 0,
    list: [],
    isValidFiles: () => false,
    getValidFiles: () => [],
};

const ContextProvider = createContext<Files>(Default);
const ContextUpdater = createContext<Action<Files>>(() => ({ index: 0, files: [] }));

export function useFiles(): ContextHook<Files> {
    return [
        useContext(ContextProvider),
        useContext(ContextUpdater),
    ];
}

export default function FilesProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [files, setFiles] = useState<Files>(Default);

    useEffect(() => {
        files.list.forEach(file => {
            URL.revokeObjectURL(file.thumbnail);
        });
        setFiles(prev => ({ ...prev, index: 0 }));
    }, [files.list]);

    return <ContextProvider.Provider value={files}>
        <ContextUpdater.Provider value={setFiles}>
            {children}
        </ContextUpdater.Provider>
    </ContextProvider.Provider>
}