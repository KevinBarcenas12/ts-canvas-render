import { createContext, useContext, useEffect, useState } from "react";
import type { ContextHook, Action, FileObject } from "./types";
type CurrentContext = {
    index: number;
    list: FileObject[];
    isValidFiles(): boolean;
    getValidFiles: () => FileObject[];
};

const Default: CurrentContext = {
    index: 0,
    list: [],
    isValidFiles: () => false,
    getValidFiles: () => [],
};

const ContextProvider = createContext<CurrentContext>(Default);
const ContextUpdater = createContext<Action<CurrentContext>>(() => ({ index: 0, files: [] }));

export function useFiles(): ContextHook<CurrentContext> {
    return [
        useContext(ContextProvider),
        useContext(ContextUpdater),
    ];
}

export default function FilesProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [files, setFiles] = useState<CurrentContext>(Default);

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