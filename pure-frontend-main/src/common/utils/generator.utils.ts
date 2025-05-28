import * as XLSX from 'xlsx';

import { formatDate } from './format.utils';

/**
 * Generate an otp of desired length. Default length is 6
 */
export function generateNumericOTP(otpLength: number = 6) {
    // Validate and set a default OTP length if not provided
    otpLength = typeof otpLength === 'number' && otpLength > 0 ? otpLength : 6;

    // Calculate the upper and lower bounds for the random number
    const lowerBound = 10 ** (otpLength - 1);
    const upperBound = 10 ** otpLength;

    // Generate a random number within the specified bounds
    const otp = Math.floor(
        lowerBound + Math.random() * (upperBound - lowerBound)
    );

    // Convert the number to a string and pad with zeros if necessary
    const formattedOTP = String(otp).padStart(otpLength, '0');

    return formattedOTP;
}

export type CSVRecord = {
    [key: string]: string | number | Date | null | undefined;
};

export function downloadCSV<T extends CSVRecord>(
    reportData: T[],
    reportName: string,
    orderedKeyMap?: { [key: string]: string }
) {
    if (!reportData.length) return;

    let headers: string[];
    let keys: string[];

    if (orderedKeyMap) {
        // Use ordered key map if provided
        headers = Object.values(orderedKeyMap);
        keys = Object.keys(orderedKeyMap);
    } else {
        // Dynamically derive keys and headers from the first data object
        keys = Object.keys(reportData[0]);
        headers = keys.map((key) => key.charAt(0).toUpperCase() + key.slice(1));
    }

    // Map rows based on keys to ensure correct order
    const data = reportData.map((item) =>
        keys.map((key) => {
            const value = item[key];

            // Handle different data types
            if (value instanceof Date) {
                return value.toISOString();
            }

            return value?.toString() ?? '';
        })
    );

    // Create a two-dimensional array with headers as the first row and data as subsequent rows
    const csvData = [headers, ...data];

    // Convert data to CSV format, escaping commas and quotes
    const csvContent = csvData
        .map((row) =>
            row
                .map((cell) => {
                    // If cell contains commas, quotes, or newlines, wrap in quotes and escape existing quotes
                    const cellStr = String(cell);
                    if (
                        cellStr.includes(',') ||
                        cellStr.includes('"') ||
                        cellStr.includes('\n')
                    ) {
                        return `"${cellStr.replace(/"/g, '""')}"`;
                    }

                    return cellStr;
                })
                .join(',')
        )
        .join('\n');

    // Create Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link and trigger click event
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${reportName}.csv`;
    link.click();

    // Clean up
    window.URL.revokeObjectURL(link.href);
}

export function downloadJSON<
    T extends Record<string, string | number | Date | null | undefined>,
>(reportData: T[], reportName: string) {
    const blob = new Blob([JSON.stringify(reportData)], {
        type: 'application/json',
    });

    // Create a download link and trigger click event
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${reportName}.json`;
    link.click();

    // Clean up
    window.URL.revokeObjectURL(link.href);
}

export type ExcelRecord = {
    [key: string]: string | number | Date | null | undefined | boolean | object;
};

const formatObjectForExcel = (obj: object): string => {
    if (Array.isArray(obj)) {
        return obj.map(formatObjectForExcel).join('; ');
    } else if (typeof obj === 'object') {
        return JSON.stringify(obj); // Convert object to JSON string
    }

    return String(obj); // Convert to string if not an object or array
};

export const downloadExcel = <T extends ExcelRecord>(
    reportData: T[],
    reportName: string,
    orderedKeyMap?: { [key: string]: string }
): boolean => {
    try {
        if (reportData.length === 0) {
            console.warn('No data provided for Excel export.');

            return false;
        }

        let headers: string[];
        let keys: string[];

        if (orderedKeyMap) {
            headers = Object.values(orderedKeyMap);
            keys = Object.keys(orderedKeyMap);
        } else {
            keys = Object.keys(reportData[0]);
            headers = keys.map(
                (key) => key.charAt(0).toUpperCase() + key.slice(1)
            );
        }

        const rows = reportData.map((item) =>
            keys.map((key) => {
                const value = item[key];

                if (value === null) {
                    return 'N/A';
                }

                if (
                    value instanceof Date ||
                    (typeof value === 'string' && isISODateString(value))
                ) {
                    const dateValue =
                        value instanceof Date ? value : new Date(value);
                    if (isNaN(dateValue.getTime())) {
                        return value;
                    }
                    const hasTime =
                        dateValue.getHours() !== 0 ||
                        dateValue.getMinutes() !== 0 ||
                        dateValue.getSeconds() !== 0;

                    return formatDate(
                        dateValue,
                        hasTime ? 'DD-MM-YYYY, H:mm A' : 'DD-MM-YYYY'
                    );
                }

                // Format object values
                if (typeof value === 'object') {
                    return formatObjectForExcel(value);
                }

                return value;
            })
        );

        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

        XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
        XLSX.writeFile(workBook, `${reportName}.xlsx`);

        return true;
    } catch (error) {
        console.error('Error exporting to Excel:', error);

        return false;
    }
};
export const downloadExcelDynamic = <T extends ExcelRecord>(
    reportData: T[],
    reportName: string,
    orderedKeyMap?: { [key: string]: string }
): boolean => {
    try {
        if (reportData.length === 0) {
            console.warn('No data provided for Excel export.');

            return false;
        }

        let headers: string[];
        let keys: string[];

        if (orderedKeyMap) {
            headers = Object.values(orderedKeyMap);
            keys = Object.keys(orderedKeyMap);
        } else {
            const allKeys = new Set();
            reportData.forEach((item) => {
                Object.keys(item).forEach((key) => allKeys.add(key));
            });

            keys = Array.from(allKeys as Set<string>).sort((a, b) => {
                if (a.startsWith('product_') && b.startsWith('product_')) {
                    const numA = parseInt(a.split('_')[1]);
                    const numB = parseInt(b.split('_')[1]);

                    return numA - numB;
                }

                return a.localeCompare(b);
            });

            // Create headers
            headers = keys.map(
                (key) => key.charAt(0).toUpperCase() + key.slice(1)
            );
        }

        const rows = reportData.map((item) =>
            keys.map((key) => {
                const value = item[key];

                if (value === null) {
                    return 'N/A';
                }

                if (
                    value instanceof Date ||
                    (typeof value === 'string' && isISODateString(value))
                ) {
                    const dateValue =
                        value instanceof Date ? value : new Date(value);
                    if (isNaN(dateValue.getTime())) {
                        return value;
                    }
                    const hasTime =
                        dateValue.getHours() !== 0 ||
                        dateValue.getMinutes() !== 0 ||
                        dateValue.getSeconds() !== 0;

                    return formatDate(
                        dateValue,
                        hasTime ? 'DD-MM-YYYY, H:mm A' : 'DD-MM-YYYY'
                    );
                }

                // Format object values
                if (typeof value === 'object') {
                    return formatObjectForExcel(value);
                }

                return value;
            })
        );

        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

        XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
        XLSX.writeFile(workBook, `${reportName}.xlsx`);

        return true;
    } catch (error) {
        console.error('Error exporting to Excel:', error);

        return false;
    }
};

// Helper function to check if a string is in ISO date format
function isISODateString(value: string): boolean {
    // Check for ISO date format (YYYY-MM-DDTHH:mm:ss.sssZ)
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

    if (!isoDateRegex.test(value)) {
        return false;
    }

    // Additional validation to ensure it creates a valid date
    const date = new Date(value);

    return !isNaN(date.getTime());
}

interface DownloadOptions {
    url: string;
    filename: string;
    forceDownload?: boolean;
}

const getFileExtension = (
    url: string,
    contentDisposition: string | null
): string => {
    // Try to get filename from Content-Disposition
    const serverFilename = contentDisposition
        ?.split('filename=')[1]
        ?.replace(/["']/g, '');

    if (serverFilename) {
        return serverFilename.substring(serverFilename.lastIndexOf('.'));
    }

    // Extract extension from URL if not available in Content-Disposition
    const urlExtension = url.split(/[#?]/)[0].split('.').pop()?.trim();

    return urlExtension ? `.${urlExtension}` : '';
};

const downloadWithBlob = async (
    url: string,
    filename: string
): Promise<boolean> => {
    const response = await fetch(url);
    const contentDisposition = response.headers.get('content-disposition');
    const fileExtension = getFileExtension(url, contentDisposition);
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `${filename}${fileExtension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(objectUrl);

    return true;
};

const downloadDirect = (url: string, filename: string): boolean => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
};

export const downloadFile = async ({
    url,
    filename,
    forceDownload = true,
}: DownloadOptions): Promise<boolean> => {
    try {
        return forceDownload
            ? await downloadWithBlob(url, filename)
            : downloadDirect(url, filename);
    } catch (error) {
        console.error('Download failed:', error);
        throw error;
    }
};
