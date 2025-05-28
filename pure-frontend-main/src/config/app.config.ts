export const appConfig = {
    api_base_url: process.env.NEXT_PUBLIC_API_BASE_URL,
    gk_banner_base_url: process.env.NEXT_PUBLIC_GK_BANNER_BASE_URL,
} as const;

// Helper function to determine environment
export const getEnvironment = () => {
    const env = process.env.NEXT_PUBLIC_ENV;
    if (!env) return null;

    if (env.includes('staging')) return 'staging';
    if (env.includes('local') || env.includes('dev')) return 'development';

    return 'production';
};
