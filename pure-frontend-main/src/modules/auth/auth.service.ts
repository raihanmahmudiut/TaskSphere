import { API_ENDPOINTS, REQUEST_METHOD } from '@/common/constants';
import {
    clearAccessAbilities,
    clearStaff,
    clearTokens,
    clearUserGroups,
    protectedApiClient,
    publicApiClient,
    setAccessAbilities,
    setBearerToken,
    setStaff,
    setUserGroups,
    standardizeApiResult,
} from '@/common/services';
import { AccessPermissionRecord, StaffRecord } from '@/common/types';
import { removeObjectKeys } from '@/common/utils';

import {
    AuthUserResponseData,
    ChangePasswordRequestBody,
    LoginResponseData,
} from './auth.type';

export async function login(
    email: string,
    password: string,
    signal?: AbortSignal
) {
    const result = await publicApiClient<LoginResponseData>({
        endpoint: API_ENDPOINTS.V2.AUTH.LOGIN,
        method: REQUEST_METHOD.POST,
        data: {
            email,
            password,
        },
        signal,
    });

    if (result.success === false)
        return {
            ...result,
            prompt_password_change: false,
            bearer_token: undefined,
        };
    else if (result.data.actions.force_password_change) {
        return {
            ...standardizeApiResult(result),
            prompt_password_change: true,
            bearer_token: result.data.payload.auth.bearer.token,
        };
    }

    const authUserResult = await getUserFromToken(
        result.data.payload.auth.bearer.token
    );

    if (authUserResult.success === false)
        return {
            ...authUserResult,
            prompt_password_change: false,
            bearer_token: undefined,
        };

    await setSession({
        bearerToken: result.data.payload.auth.bearer.token,
        staff: result.data.payload.staff,
        accessPermission: authUserResult.data.access_permission,
    });

    return {
        ...authUserResult,
        prompt_password_change: false,
        bearer_token: result.data.payload.auth.bearer.token,
    };
}

export async function getUserFromToken(token: string, signal?: AbortSignal) {
    const result = await protectedApiClient<AuthUserResponseData>({
        endpoint: API_ENDPOINTS.V2.AUTH.ME,
        method: REQUEST_METHOD.GET,
        bearerToken: token,
        signal,
    });

    return standardizeApiResult(result);
}

async function setSession({
    bearerToken,
    staff,
    accessPermission,
}: {
    bearerToken: string;
    staff: StaffRecord;
    accessPermission: AccessPermissionRecord;
}) {
    await Promise.all([
        setBearerToken(bearerToken),
        setStaff(staff),
        setUserGroups(accessPermission.user_groups),
        setAccessAbilities(accessPermission.access_ability),
    ]);
}

export async function logout() {
    await Promise.all([
        clearTokens(),
        clearStaff(),
        clearUserGroups(),
        clearAccessAbilities(),
    ]);
}

export async function changeAdminPassword(
    requestData: ChangePasswordRequestBody,
    signal?: AbortSignal
) {
    const result = await protectedApiClient({
        endpoint: API_ENDPOINTS.V2.AUTH.CHANGE_PASSWORD,
        method: REQUEST_METHOD.POST,
        data: requestData,
        signal,
    });

    return {
        success: result.success,
    };
}

export async function changeAdminPasswordAndPersistSessionViaForcePasswordChangePrompt(
    data: ChangePasswordRequestBody,
    bearerToken: string,
    signal?: AbortSignal
) {
    const resultForPasswordChange = await protectedApiClient({
        endpoint: API_ENDPOINTS.V2.AUTH.CHANGE_PASSWORD,
        method: REQUEST_METHOD.POST,
        data,
        bearerToken,
        signal,
    });

    if (!resultForPasswordChange.success)
        return standardizeApiResult(resultForPasswordChange);

    const authUserResult = await getUserFromToken(bearerToken);

    if (authUserResult.success === false) return authUserResult;

    const { access_permission, ...staff } = authUserResult.data;

    await setSession({
        staff: removeObjectKeys(staff, ['user_groups']),
        accessPermission: access_permission,
        bearerToken,
    });

    return authUserResult;
}
