import { z } from 'zod';

/**
 * Throws an error if the provided value is not a string.
 * Otherwise returns the string
 * @throws { Error }
 */
export function mustBeStringOrFail(value?: string) {
    if (typeof value === 'string') return value;
    throw new Error('Provided value must be a string.');
}

export function splitStringByLastOccurrence(
    inputString: string,
    delimiter: string
) {
    const lastOccurrenceIndex = inputString.lastIndexOf(delimiter);

    if (lastOccurrenceIndex !== -1) {
        const firstPart = inputString.substring(0, lastOccurrenceIndex);
        const secondPart = inputString.substring(lastOccurrenceIndex + 1);

        return [firstPart, secondPart];
    } else {
        // If the delimiter is not found, return the original string as the first part and an empty string as the second part
        return [inputString, ''];
    }
}

export function removeTrailingSlash(
    url: string,
    once: boolean = false
): string {
    return url.endsWith('/')
        ? once
            ? url.slice(0, -1)
            : removeTrailingSlash(url.slice(0, -1))
        : url;
}

export function capitalizeFirstLetter(
    string: string,
    rest_lowercase: boolean = false
) {
    return (
        string.charAt(0).toUpperCase() +
        (rest_lowercase ? string.slice(1).toLowerCase() : string.slice(1))
    );
}

export function fallBackIfNullish<T, R>(
    value: T | null | undefined,
    fallBackValue: R
) {
    return value ? value : fallBackValue;
}

export function convertToNumberFallback(
    value: string | number | null | undefined,
    fallBackValue: string | number | undefined
): number {
    console.log('Initial values:', {
        valueType: typeof value,
        value: value,
        fallBackValueType: typeof fallBackValue,
        fallBackValue: fallBackValue,
    });

    // Step 1: Set `valueToProcess` to `value` or fallback to `fallBackValue`
    const valueToProcess = value ?? fallBackValue;
    console.log('Value to process:', {
        valueToProcessType: typeof valueToProcess,
        valueToProcess: valueToProcess,
    });

    // Step 2: If `valueToProcess` is already a number, return it directly
    if (typeof valueToProcess === 'number') {
        console.log('Returning number directly:', valueToProcess);

        return valueToProcess;
    }

    // Step 3: Attempt to parse `valueToProcess` if it’s a string
    const parsed = parseFloat(valueToProcess as string);
    console.log('Parsed result from valueToProcess:', {
        parsedType: typeof parsed,
        parsedValue: parsed,
    });

    // Step 4: Check if parsed is a valid number; return it if it is
    if (!isNaN(parsed)) {
        console.log('Returning parsed value:', parsed);

        return parsed;
    }

    // Step 5: If `parsed` is NaN, attempt to parse `fallBackValue` as a last resort
    const fallbackParsed = parseFloat(fallBackValue as string);
    console.log('Parsed result from fallBackValue:', {
        fallbackParsedType: typeof fallbackParsed,
        fallbackParsedValue: fallbackParsed,
    });

    // Step 6: Return parsed fallback value if valid, else default to 0
    const result = !isNaN(fallbackParsed) ? fallbackParsed : 0;
    console.log('Final result:', result);

    return result;
}

/// Complex Zod Schema Parsing for Dynamic Form Fields

type SchemaShape = Record<string, z.ZodType>;

/**
 * Parses settings object values according to a Zod schema shape.
 * Handles common Zod types including boolean, string, number, enum, and effects.
 *
 * @param settings - Object containing setting values to be parsed
 * @param schemaShape - Object containing Zod type definitions for each field
 * @returns Parsed settings object with values converted to their proper types
 */
export function parseSettings(
    settings: Record<string, unknown>,
    schemaShape: SchemaShape
): Record<string, unknown> {
    return Object.entries(settings).reduce(
        (acc, [key, value]) => {
            const schemaField = schemaShape[key];

            try {
                const unwrappedField =
                    schemaField instanceof z.ZodOptional
                        ? schemaField.unwrap()
                        : schemaField;

                if (unwrappedField instanceof z.ZodBoolean) {
                    acc[key] = Boolean(value);
                } else if (unwrappedField instanceof z.ZodString) {
                    acc[key] = String(value);
                } else if (unwrappedField instanceof z.ZodEffects) {
                    acc[key] = value;
                } else if (unwrappedField instanceof z.ZodEnum) {
                    acc[key] = value;
                } else if (unwrappedField instanceof z.ZodNumber) {
                    acc[key] = parseFloat(value as string);
                }
            } catch (error) {
                acc[key] = value;
            }

            return acc;
        },
        {} as Record<string, unknown>
    );
}

export function sanitizePhoneNumber(number: string) {
    const sanitizedText = number.replace(/\D/g, ''); // Remove non-numeric characters

    // Check if the sanitized text is equal to the original number
    if (sanitizedText !== number) {
        throw 'Invalid phone number'; // Stop execution if the phone number contains non-numeric characters
    }

    if (sanitizedText.startsWith('88')) {
        return sanitizedText.substring(2, 13);
    } else {
        return sanitizedText.substring(0, 11);
    }
}

export function getInitialsFromName(name: string) {
    const hasTokens = name.indexOf(' ') !== -1;
    const initials =
        name.substring(0, hasTokens ? 1 : 2) +
        (hasTokens ? name.charAt(name.lastIndexOf(' ') + 1) : '');

    return initials.toUpperCase();
}

export const toSnakeCase = (str: string | undefined): string =>
    str ? str.toLowerCase().replace(/\s+/g, '_') : '';
