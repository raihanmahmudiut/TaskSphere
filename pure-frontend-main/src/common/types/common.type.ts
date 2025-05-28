export type Permission = {
    [index: string]: string;
};

export type RequestBodyMeta = {
    meta: {
        device_info: string;
    };
};

export type PaginationMeta = {
    total: number;
    count: number;
    per_page: number;
    total_pages: number;
    current_page: number;
};

export type APIExceptionResponse = {
    status_code: number;
    error_code: number;
};
