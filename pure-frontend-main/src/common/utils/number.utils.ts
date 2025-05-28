export function parseIntOrFail(input: string): number {
    const parsedInt = parseInt(input, 10);

    if (isNaN(parsedInt)) {
        throw new Error('Failed to parse the input to an integer.');
    }

    return parsedInt;
}

export function parseIntOrFallback(input: string, fallback: number): number {
    const parsedInt = parseInt(input, 10);

    if (isNaN(parsedInt)) {
        return fallback;
    }

    return parsedInt;
}

/**
 * rounds up a decimal number to two
 */
export function roundToTwo(num?: number): string {
    return (+(Math.round(Number(num + 'e+2')) + 'e-2')).toLocaleString('en-US');
}

/**
 * multiplies two number
 */
export function multiply(num1: number, num2: number) {
    return num1 * num2;
}

/**
 * truncates a decimal number to four decimal points
 */
export function truncateToFourDecimalPoint(num: number): number {
    return truncate(num, 4);
}

export function truncate(
    num: number,
    numberOfDigitsAfterDecimal: number
): number {
    if (
        typeof num !== 'number' ||
        typeof numberOfDigitsAfterDecimal !== 'number' ||
        numberOfDigitsAfterDecimal < 0
    ) {
        throw new Error(
            'Invalid input. Both arguments must be numbers, and numberOfDigitsAfterDecimal must be non-negative.'
        );
    }

    const x = num + '';

    return x.lastIndexOf('.') >= 0
        ? parseFloat(
              x.slice(0, x.lastIndexOf('.') + (numberOfDigitsAfterDecimal + 1))
          )
        : num;
}

export function round(num: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);

    return Math.round(num * factor) / factor;
}

export function parseNumericStrings<T extends Record<string, number | string>>(
    data: T
): T {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
            if (typeof value === 'string' && !isNaN(Number(value))) {
                return [key, Number(value)];
            }

            return [key, value];
        })
    ) as T;
}
