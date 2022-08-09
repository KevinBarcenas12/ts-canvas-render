export function trimExtension(string: string) {
    return string.replace(/\.[^/.]+$/, "");
}

export function getExtension(string: string) {
    return string.split(".").pop() || "";
}

type VideoType = ".mp4" | ".webm" | ".ogg" | ".mov";
type CodecType = "QuickTime" | "WebM" | "Ogg" | "MP4" | null;
const VIDEO_EXTENSIONS: [VideoType, CodecType][] = [
    [".mp4", "MP4"],
    [".webm", "WebM"],
    [".ogg", "Ogg"],
    // [".mov", "QuickTime"],
];

export function isValidVideoExtension(string: string): [ boolean, CodecType ] {
    for (let ext of VIDEO_EXTENSIONS) if (string.endsWith(ext[0])) return [true, ext[1]];
    return [false, null];
}

export function capitalize(string: string) {
    if (string.length < 1) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeAll(string: string) {
    if (string.length < 1) return "";
    return string
        .split(" ")
        .map(word => capitalize(word))
        .join(" ");
}

export function setSpaces(string: string) {
    string = string.replace(/_/g, " ");
    if (string.includes("-")) {
        string = string.replace(/ - |---/g, "@sep@");
        string = string.replace(/-/g, " ");
    }
    if (string.includes(".")) string = string.replace(/\./g, " ");
    
    string = string.replace(/@sep@/g, " - ");
    string = string.replace(/ - (.)/g, match => ` - ${match.charAt(3).toUpperCase()}`);

    return string;
}

export function replaceEp(string: string) {
    return string.replace(/(ep )|(Ep )/g, "Episode ");
}

export function getTitle(string: string) {
    return capitalize(replaceEp(setSpaces(trimExtension(string))));
}

const Units = ["b", "Kb", "Mb", "Gb", "Tb"];

export function getSize(size: number, unit = 0) {
    while (size > 1024) {
        size /= 1024;
        unit++;
    }
    return `${size.toFixed(1)}${Units[unit]}`;
}

export function getTime(time: number) {
    let isReversed = false;
    if (time < 0) {
        time = -time;
        isReversed = true;
    }
    let Format = time >= 3600 ? "$h:$m:$s" : "$m:$s";
    if (isReversed) Format = `-${Format}`;
    const Hours = Math.floor((time / 3600) % (3600 * 24));
    const Minutes = Math.floor((time / 60) % 3600);
    const Seconds = Math.floor(time % 60);
    return Format
        .replace("$h", `${Hours}`)
        .replace("$m", `${(Minutes < 10 && time >= 3600) ? `0${Minutes}` : Minutes}`)
        .replace("$s", `${Seconds < 10 ? `0${Seconds}` : Seconds}`);
}

interface FormatObject {
    readonly withHours: string;
    readonly default: string;
    withZero: boolean;
    applyZero: (input: number) => string;
    placeholders: {
        readonly hours: string;
        readonly minutes: string;
        readonly seconds: string;
    }
}

const DefaultFormat: FormatObject = {
    withHours: "$h:$m:$s",
    default: "$m:$s",
    withZero: false,
    applyZero: (input = 0) => input < 10 ? `0${input}` : `${input}`,
    placeholders: {
        hours: "$h",
        minutes: "$m",
        seconds: "$s",
    },
}

export function getTimeInFormat(time: number, formatObj: Partial<FormatObject> = DefaultFormat) {
    let isReversed = time < 0;
    isReversed && (time = -time);

    const format = { ...DefaultFormat, ...formatObj, };
    
    let Format = time >= 3600 ? format.withHours : format.default;
    if (isReversed) Format = `-${Format}`;

    const h = Math.floor((time / 3600) % (3600 * 24));
    const m = Math.floor((time / 60) % 3600);
    const s = Math.floor(time % 60);

    return Format
        .replace(format.placeholders.hours, format.applyZero(h))
        .replace(format.placeholders.minutes, format.applyZero(m))
        .replace(format.placeholders.seconds, format.applyZero(s));
}

interface ExtendedFormatObject {
    readonly symbols: {
        readonly negative: string;
        readonly positive: string;
    };
    readonly formats: {
        readonly hours: string;
        readonly minutes: string;
        readonly seconds: string;
    };
    readonly placeholders: {
        readonly hours: string;
        readonly minutes: string;
        readonly seconds: string;
        readonly symbol: string;
    };
}

const ExtendedFormat: ExtendedFormatObject = {
    symbols: {
        negative: "-",
        positive: "+",
    },
    formats: {
        hours: "$S$hh $mmin $ssec",
        minutes: "$S$mmin $ssec",
        seconds: "$S$ssec",
    },
    placeholders: {
        hours: "$h",
        minutes: "$m",
        seconds: "$s",
        symbol: "$S",
    },
};

export function getTimeExtended(time: number, formatObj: Partial<ExtendedFormatObject> = ExtendedFormat) {
    const negative = time < 0;
    negative && (time = -time);
    const format = { ...ExtendedFormat, ...formatObj, };

    const Format = time >= 3600 ? format.formats.hours : time >= 60 ? format.formats.minutes : format.formats.seconds;

    const h = Math.floor((time / 3600) % (3600 * 24));
    const m = Math.floor((time / 60) % 3600);
    const s = Math.floor(time % 60);

    return Format
        .replace(format.placeholders.symbol, negative ? format.symbols.negative : format.symbols.positive)
        .replace(format.placeholders.hours, `${h}`)
        .replace(format.placeholders.minutes, `${m}`)
        .replace(format.placeholders.seconds, `${s}`);
}

export function concat(inputs: string[], separator: string) {
    return inputs.join(separator);
}

const String = {
    trimExtension,
    getExtension,
    isValidVideoExtension,
    capitalize,
    capitalizeAll,
    concat,
    setSpaces,
    replaceEp,
    getTitle,
    getSize,
    getTime,
    getTimeInFormat,
    getTimeExtended,
};

export default String;