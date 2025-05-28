import { Permission } from '../types/common.type';
import { UserGroupRecord } from '../types/records.type';
import { decomposePermissionString } from './acl.utils';

export function isEmptyObject(input?: object) {
    return (
        (input &&
            typeof input === 'object' &&
            Object.keys(input).length === 0) === true
    );
}

export function flattenArrayOfObjectToObject(
    arr: Array<Record<string, object>>
) {
    return arr.reduce((result, current) => {
        for (const key in current) {
            if (Object.prototype.hasOwnProperty.call(current, key)) {
                result[key] = current[key];
            }
        }

        return result;
    }, {});
}

export const renameKeys = <
    T extends Record<string, object>,
    M extends Partial<Record<keyof T, string>>,
>(
    originalObject: T,
    keyMapping: M
): AliasedKey<T, M> => {
    if (typeof originalObject !== 'object') return originalObject;

    const newObject = {} as Anything;

    Object.keys(originalObject).map((oldKey: keyof T) => {
        const newKey = keyMapping[oldKey] || oldKey;
        newObject[newKey] = originalObject[oldKey];
    });

    return newObject;
};

export function removeObjectKeys<
    T extends Record<string, Anything>,
    K extends keyof T,
>(obj: T, keys: K[]): ObjectWithoutKey<T, K> {
    const result = { ...obj };
    keys.forEach((key) => {
        delete result[key];
    });

    return result as ObjectWithoutKey<T, K>;
}

export function convertPermissionsForApiCall(permissions: Permission) {
    const finalPermissions = Object.entries(permissions);
    const convertedPermissions = finalPermissions.map((permission) => {
        return {
            feature_component_id: permission[0],
            permission_group_id: permission[1],
        };
    });

    return convertedPermissions;
}

export function convertPermissionsFromUserGroupDetails(
    userGroup: UserGroupRecord
) {
    let tempPermissions = {};
    userGroup.permissions?.forEach((ps) => {
        const permission = decomposePermissionString(ps.permission);

        tempPermissions = {
            ...tempPermissions,
            [permission.feature_component_id]: permission.permission_group_id,
        };
    });

    return tempPermissions;
}
