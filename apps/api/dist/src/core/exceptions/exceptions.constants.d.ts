export declare class ExceptionConstants {
    static readonly BadRequestCodes: {
        MISSING_REQUIRED_PARAMETER: number;
        INVALID_PARAMETER_VALUE: number;
        UNSUPPORTED_PARAMETER: number;
        INVALID_CONTENT_TYPE: number;
        INVALID_REQUEST_BODY: number;
        RESOURCE_ALREADY_EXISTS: number;
        RESOURCE_NOT_FOUND: number;
        REQUEST_TOO_LARGE: number;
        REQUEST_ENTITY_TOO_LARGE: number;
        REQUEST_URI_TOO_LONG: number;
        UNSUPPORTED_MEDIA_TYPE: number;
        METHOD_NOT_ALLOWED: number;
        HTTP_REQUEST_TIMEOUT: number;
        VALIDATION_ERROR: number;
        UNEXPECTED_ERROR: number;
        INVALID_INPUT: number;
    };
    static readonly UnauthorizedCodes: {
        UNAUTHORIZED_ACCESS: number;
        INVALID_CREDENTIALS: number;
        JSON_WEB_TOKEN_ERROR: number;
        AUTHENTICATION_FAILED: number;
        ACCESS_TOKEN_EXPIRED: number;
        TOKEN_EXPIRED_ERROR: number;
        UNEXPECTED_ERROR: number;
        RESOURCE_NOT_FOUND: number;
        USER_NOT_VERIFIED: number;
        REQUIRED_RE_AUTHENTICATION: number;
        INVALID_RESET_PASSWORD_TOKEN: number;
    };
    static readonly InternalServerErrorCodes: {
        INTERNAL_SERVER_ERROR: number;
        DATABASE_ERROR: number;
        NETWORK_ERROR: number;
        THIRD_PARTY_SERVICE_ERROR: number;
        SERVER_OVERLOAD: number;
        UNEXPECTED_ERROR: number;
    };
    static readonly ForbiddenCodes: {
        FORBIDDEN: number;
        MISSING_PERMISSIONS: number;
        EXCEEDED_RATE_LIMIT: number;
        RESOURCE_NOT_FOUND: number;
        TEMPORARILY_UNAVAILABLE: number;
    };
}
