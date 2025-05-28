import { AccessPermissionRecord, StaffRecord } from '@/common/types';

export type LoginResponseData = {
    payload: {
        auth: {
            bearer: {
                token: string;
                expires_at: number;
            };
        };
        staff: StaffRecord;
    };
    actions: {
        force_password_change: boolean;
    };
};

export type AuthUserResponseData = StaffRecord & {
    access_permission: AccessPermissionRecord;
};

export type ChangePasswordRequestBody = {
    current_password: string;
    new_password: string;
};
