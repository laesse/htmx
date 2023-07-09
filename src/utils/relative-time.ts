
const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
} as const;

const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
    style: "narrow",
});
export const getRelativeTime = (d1: Date, d2 = new Date()) => {
    const elapsed = +d1 - +d2;
    for (const u of Object.keys(units) as (keyof typeof units)[])
        if (Math.abs(elapsed) > units[u] || u == "second")
            return rtf.format(Math.round(elapsed / units[u]), u);
};