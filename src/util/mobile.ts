export default function isMobile() {
    const devices = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /IEMobile/i,
        /Opera Mini/i,
    ];
    return devices.some(_ => navigator.userAgent.match(_));
}
