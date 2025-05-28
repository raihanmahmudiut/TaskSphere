import dayjs from '@dayjs';

export function formatBDPhoneNumber(phoneNumber: string) {
    // Remove non-numeric characters
    const numericOnly = phoneNumber.replace(/\D/g, '');

    const countryCode = '+880';

    // Remove leading '0' or '880'
    const withoutLeadingZeroOrEight = numericOnly.replace(/^0|^(880)/, '');

    return countryCode + withoutLeadingZeroOrEight;
}

export function formatGold(
    amount: string | number | undefined | null
): number | undefined | null {
    if (amount === undefined || amount === null) return amount;

    let numAmount: number;
    if (typeof amount === 'number') {
        numAmount = amount;
    } else {
        numAmount = parseFloat(amount);
    }

    // Round to 4 decimal places without converting to string
    return Math.round(numAmount * 10000) / 10000;
}

export function formatTaka(
    amount: string | number | undefined | null
): number | undefined | null {
    if (amount === undefined || amount === null) return amount;

    let numAmount: number;
    if (typeof amount === 'number') {
        numAmount = amount;
    } else {
        numAmount = parseFloat(amount);
    }

    // Round to 2 decimal places without converting to string
    return Math.round(numAmount * 100) / 100;
}

/**
 * Formats a date string or Date object into a specified format.
 * Defaults to "DD MMM YYYY, hh:mm a" if no format is provided.
 *
 * @param {string | Date | null} dateString - The date to format.
 * @param {string} format - The desired format (default is "DD MMM YYYY, hh:mm a").
 * @returns {string} The formatted date string, or "N/A" if the input is invalid.
 */
export const formatDate = (
    dateString: string | Date | null,
    format: string = 'MMM D, YYYY, h:mm A'
): string => {
    if (!dateString) {
        return 'N/A';
    }

    return `\t${dayjs(dateString).tz(APP_TIMEZONE).format(format)}`;
};

export const formatDateOnly = (dateString: string | Date | null): string => {
    if (!dateString) return 'N/A';

    return `\t${dayjs(dateString).tz(APP_TIMEZONE).format('DD-MM-YYYY')}`;
};

export const formatTimeOnly = (dateString: string | Date | null): string => {
    if (!dateString) return 'N/A';

    return `\t${dayjs(dateString).tz(APP_TIMEZONE).format('h:mm A')}`;
};

export const formatTime = (timeString: string): string => {
    const date = dayjs(timeString, 'HH:mm:ss');

    return date.format('h:mm:ss A');
};

/**
 * Formats the description field from JSON to a readable string or JSX.
 * @param {string} description - The description field as a JSON string.
 * @param {boolean} asHtml - Whether to return JSX (for table) or a string (for Excel).
 * @returns {string | JSX.Element} - The formatted description.
 */
// Application timezone constant
export const APP_TIMEZONE = 'Asia/Dhaka';

/**
 * Formats a date in the application's timezone with timezone information
 * @param date - The date to format
 * @param format - Output format (default: 'YYYY-MM-DDTHH:mm:ssZ')
 * @param tz - Timezone to use (default: APP_TIMEZONE)
 * @returns Formatted date string
 */
export const formatRequestDateWithTimezone = (
    date: Date | string | number | null | undefined,
    format: string = 'YYYY-MM-DDTHH:mm:ssZ',
    tz: string = APP_TIMEZONE
): string | null => {
    if (date === null || date === undefined) return null;

    return dayjs(date).tz(tz).format(format);
};

/**
 * Converts a date to UTC format
 * @param date - The date to convert
 * @param format - Output format (default: 'YYYY-MM-DDTHH:mm:ss')
 * @param sourceTz - Source timezone (default: APP_TIMEZONE)
 * @returns UTC formatted date string
 */
export const convertToUTC = (
    date: Date | string | number | null | undefined,
    format: string = 'YYYY-MM-DDTHH:mm:ss'
): string | null => {
    if (date === null || date === undefined) return null;

    return dayjs(date).utc().format(format);
};
