/* eslint-disable @typescript-eslint/no-unused-vars */
export const Exception = {
    BadRequestException: {
        UNKNOWN: {
            ERROR_CODE: 40000,
            MESSAGE: <T>(context?: T) => 'Bad Request!',
        },
        VALIDATION_FAILED: {
            ERROR_CODE: 40001,
            MESSAGE: <T>(context?: T) => 'Validation Failed!',
        },
        INVALID_QUERY: {
            ERROR_CODE: 40002,
            MESSAGE: <T>(context?: T) => 'Invalid Query String!',
        },
    },
    ForbiddenException: {
        UNKNOWN: {
            ERROR_CODE: 40300,
            MESSAGE: <T>(context?: T) => 'Forbidden!',
        },
        ALREADY_EXISTS: {
            ERROR_CODE: 40301,
            MESSAGE: <T>(context?: T) => 'Entity Already Exists!',
        },
        NOT_FOUND: {
            ERROR_CODE: 40302,
            MESSAGE: <T>(context?: T) => 'Entity Not Found!',
        },
        IDENTIFIER_NOT_FOUND: {
            ERROR_CODE: 40303,
            MESSAGE: <T>(context?: T) => 'Specified Identifier Not Found!',
        },
        INVALID_PHONE_NUMBER: {
            ERROR_CODE: 40304,
            MESSAGE: <T>(context?: T) => 'Invalid Phone Number!',
        },
        NOT_IN_DESIRED_STATE: {
            ERROR_CODE: 40305,
            MESSAGE: <T>(context?: T) => 'Cannot Perform Specified Action.',
        },
        AUTHORIZATION_FAILED: {
            ERROR_CODE: 40306,
            MESSAGE: <T>(context?: T) => 'Authorization Failed!',
        },
        FEATURE_DISABLED: {
            ERROR_CODE: 40307,
            MESSAGE: <T>(context?: T) => 'Feature Is Disabled!',
        },
        NOT_ALLOWED: {
            ERROR_CODE: 40308,
            MESSAGE: <T>(context?: T) => 'Specified Action Not Allowed.',
        },
    },
    InternalServerErrorException: {
        UNKNOWN: {
            ERROR_CODE: 50000,
            MESSAGE: <T>(context?: T) => 'Something Went Wrong!',
        },
    },
    NotFoundException: {
        UNKNOWN: {
            ERROR_CODE: 40400,
            MESSAGE: <T>(context?: T) => 'Not Found!',
        },
        ENTITY_NOT_FOUND: {
            ERROR_CODE: 40401,
            MESSAGE: <T>(context?: T) => 'Entity Not Found!',
        },
    },
    UnauthorizedException: {
        UNKNOWN: {
            ERROR_CODE: 40100,
            MESSAGE: <T>(context?: T) => 'Unauthorized!',
        },
        INVALID_CREDENTIALS: {
            ERROR_CODE: 40101,
            MESSAGE: <T>(context?: T) => 'Invalid Credentials!',
        },
        INCORRECT_CREDENTIALS: {
            ERROR_CODE: 40102,
            MESSAGE: <T>(context?: T) => 'Incorrect Credentials!',
        },
        REQUIRES_TOKEN: {
            ERROR_CODE: 40103,
            MESSAGE: <T>(context?: T) => 'Token Required!',
        },
        UNPROCESSABLE_TOKEN: {
            ERROR_CODE: 40104,
            MESSAGE: <T>(context?: T) => 'Unprocessable Token!',
        },
    },
    UnprocessableEntityException: {
        UNKNOWN: {
            ERROR_CODE: 42200,
            MESSAGE: <T>(context?: T) => 'Unprocessable!',
        },
        UNIQUE_VALIDATION_FAILED: {
            ERROR_CODE: 42201,
            MESSAGE: <T>(context?: T) => 'Entity Already Exists!',
        },
        NOT_ALLOWED: {
            ERROR_CODE: 42202,
            MESSAGE: <T>(context?: T) => 'Specified Action Not Allowed.',
        },
    },
} as const;
