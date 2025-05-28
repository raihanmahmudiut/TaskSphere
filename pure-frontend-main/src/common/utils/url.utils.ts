export function replaceUrlVars(
    url: string,
    vars?: Record<string, string | number | boolean>
) {
    if (!vars) return url;

    return url.replace(/{([^{}]*)}/g, (match: string, key: string) => {
        return (vars[key] || match) as string;
    });
}
