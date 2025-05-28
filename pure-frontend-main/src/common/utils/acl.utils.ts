import { ACCESS_LEVEL, IMMEDIATE_NEXT_ACCESS_LEVELS } from '../constants';
import { mustBeStringOrFail } from './string.utils';

export function decomposePermissionString(permissionString: string) {
    const splitted = mustBeStringOrFail(permissionString).split(':');

    if (splitted.length !== 3) {
        throw new Error('Invalid Permission String');
    }

    return {
        user_group_id: mustBeStringOrFail(splitted[0]),
        feature_component_id: mustBeStringOrFail(splitted[1]),
        permission_group_id: mustBeStringOrFail(splitted[2]),
    };
}

export function composePermissionString({
    userGroupId,
    featureComponentId,
    permissionGroupId,
}: {
    userGroupId: string;
    featureComponentId: string;
    permissionGroupId: string;
}) {
    return `${userGroupId}:${featureComponentId}:${permissionGroupId}`;
}

export function composeAccessAbility(
    decomposedPermissions: {
        user_group_id: string;
        feature_component_id: string;
        permission_group_id: string;
    }[],
    permissionGroups: {
        id: string;
        access_level: string;
        can_view: number;
        can_insert: number;
        can_edit: number;
        can_delete: number;
        can_authorize: number;
        can_reject: number;
        can_submit: number;
    }[]
) {
    const accessAbility: {
        [index: string]: {
            access_level?: string;
            can_view: boolean;
            can_insert: boolean;
            can_edit: boolean;
            can_delete: boolean;
            can_authorize: boolean;
            can_reject: boolean;
            can_submit: boolean;
        };
    } = {};

    decomposedPermissions.map((decomposedPermission) => {
        const permissionGroup = permissionGroups.find(
            (pg) => pg.id === decomposedPermission.permission_group_id
        );
        accessAbility[decomposedPermission.feature_component_id] = {
            access_level: permissionGroup?.access_level,
            can_view:
                permissionGroup !== undefined && permissionGroup.can_view === 1,
            can_insert:
                permissionGroup !== undefined &&
                permissionGroup.can_insert === 1,
            can_edit:
                permissionGroup !== undefined && permissionGroup.can_edit === 1,
            can_delete:
                permissionGroup !== undefined &&
                permissionGroup.can_delete === 1,
            can_authorize:
                permissionGroup !== undefined &&
                permissionGroup.can_authorize === 1,
            can_reject:
                permissionGroup !== undefined &&
                permissionGroup.can_reject === 1,
            can_submit:
                permissionGroup !== undefined &&
                permissionGroup.can_submit === 1,
        };
    });

    return accessAbility;
}

export function getImmediateNextAccessLevels(
    currentAccessLevel: valueof<typeof ACCESS_LEVEL>
): Array<valueof<typeof ACCESS_LEVEL>> {
    return IMMEDIATE_NEXT_ACCESS_LEVELS[currentAccessLevel];
}
