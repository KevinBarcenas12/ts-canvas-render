export type Timer = NodeJS.Timeout | NodeJS.Timer | null | (() => void);

type CodecType = "QuickTime" | "WebM" | "Ogg" | "MP4" | null;
export interface FileObject {
    readonly name: string;
    readonly size: number;
    readonly isValid: boolean;
    readonly content: File;
    thumbnail: string;
    codec: CodecType;
}