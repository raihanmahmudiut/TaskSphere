import { appConfig } from '@/config';

export default function defaultLoader({
    src,
    width,
    height,
}: {
    src: string;
    width: number;
    height?: number;
}) {
    // Check if the URL already contains query parameters
    const urlParts = src.split('?');
    const baseUrl = urlParts[0];
    const existingQueryString = urlParts[1] || '';

    // If it's an S3 URL or full URL, return it as-is
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }

    // For non-http URLs, append width and height
    const widthHeightQuery = `w=${width}&h=${height || 75}`;

    // Combine existing query string with new parameters if needed
    return existingQueryString
        ? `${baseUrl}?${existingQueryString}&${widthHeightQuery}`
        : `${baseUrl}?${widthHeightQuery}`;
}

export function bannerImageLoader({
    src,
    width,
    height,
}: {
    src: string;
    width: number;
    height?: number;
}) {
    return `${appConfig.gk_banner_base_url}/${src}?w=${width}&h=${height || 75}`;
}
