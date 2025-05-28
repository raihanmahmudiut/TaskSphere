import { ACCESS_LEVEL, API_ENDPOINTS, NAV_ITEMS } from '@/common/constants';
import {
    getAccessAbleSubmoduleIds,
    protectedApiClient,
} from '@/common/services';
import { getAbilityForComponent, getUserGroups } from '@/common/services';
import { AccessPermissionRecord, NavItem } from '@/common/types';

export async function fetchAccessPermissionOfStaff(
    staffId: string,
    signal?: AbortSignal
) {
    const result = await protectedApiClient<AccessPermissionRecord>({
        endpoint: API_ENDPOINTS.V2.ACL.ACCESS_PERMISSION,
        urlVars: {
            staffId,
        },
        method: 'GET',
        signal,
    });

    return result;
}

export async function hasPermission(
    componentIdOrRelatedComponentId: string,
    {
        action,
        actions,
        accessLevel,
        lastAuthorizer,
        currentUserId,
    }: {
        action?:
            | 'can_view'
            | 'can_insert'
            | 'can_edit'
            | 'can_delete'
            | 'can_authorize'
            | 'can_submit'
            | 'can_reject';
        actions?: Array<
            | 'can_view'
            | 'can_insert'
            | 'can_edit'
            | 'can_delete'
            | 'can_authorize'
            | 'can_submit'
            | 'can_reject'
        >;
        accessLevel?: valueof<typeof ACCESS_LEVEL>;
        lastAuthorizer?: string;
        currentUserId?: string;
    } = {}
) {
    let hasAccess = true;

    if (!currentUserId) return false;

    const accessToComponent = await getAbilityForComponent(
        componentIdOrRelatedComponentId
    );

    if (!accessToComponent) return false;
    if (accessToComponent['access_level'] === 'NO_ACCESS') return false;

    // Check if current user is the last authorizer
    if (
        accessToComponent['access_level'] !== ACCESS_LEVEL.SUPER_USER &&
        lastAuthorizer === currentUserId
    ) {
        return false;
    }

    if (accessLevel) {
        hasAccess =
            accessToComponent['access_level'] === ACCESS_LEVEL.SUPER_USER ||
            accessToComponent['access_level'] === accessLevel;
    }

    // Handle single action
    if (action) {
        hasAccess = hasAccess && accessToComponent[action];
    }

    // Handle multiple actions
    if (actions && actions.length > 0) {
        hasAccess = hasAccess && actions.some((act) => accessToComponent[act]);
    }

    return hasAccess;
}

export async function underUserGroup(userGroupPrefix: string) {
    const userGroups = await getUserGroups();

    const hasAccess = userGroups.some((group) =>
        group.startsWith(userGroupPrefix)
    );

    return hasAccess;
}

export async function getAccessAbleNavItems() {
    const submoduleIds = await getAccessAbleSubmoduleIds();
    const userGroupIds = await getUserGroups();

    return filterNavItems(submoduleIds, userGroupIds);
}

const filterNavItems = (subModuleIds: string[], userGroupIds: string[]) => {
    const filteredItems: NavItem[] = [];

    NAV_ITEMS.forEach((parentItem) => {
        if (
            parentItem.public ||
            (parentItem.userGroup &&
                userGroupIds.includes(parentItem.userGroup))
        ) {
            filteredItems.push(parentItem);
        } else {
            const filteredChildren: NavItem[] = [];

            parentItem.children?.forEach((children) => {
                if (
                    children.public ||
                    subModuleIds.includes(children.id) ||
                    (children.userGroup &&
                        userGroupIds.includes(children.userGroup))
                ) {
                    filteredChildren.push(children);
                }
            });

            if (filteredChildren.length) {
                filteredItems.push({
                    ...parentItem,
                    children: filteredChildren,
                });
            }
        }
    });

    return filteredItems;
};
