export function jsonSafeParseArray(dataString?: string) {
    if (dataString && typeof dataString !== 'string') return dataString;

    try {
        const parsed = JSON.parse(dataString || '[]');

        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        return [];
    }
}

export function jsonSafeParseObject<T extends object>(
    dataString?: string
): Partial<T> {
    if (dataString && typeof dataString !== 'string') return dataString;

    try {
        return JSON.parse(dataString || '{}');
    } catch (err) {
        return {};
    }
}

export function jsonSafeParse<T>(dataString?: string): T | string | undefined {
    if (dataString && typeof dataString !== 'string') return dataString;

    if (!dataString) return dataString;

    try {
        return JSON.parse(dataString);
    } catch (err) {
        return dataString;
    }
}

export function strikeThrough(
    value1: string | number | null | undefined,
    value2: string | number | null | undefined
) {
    if (value1 === value2) {
        return '';
    } else return 'line-through';
}
