import { jwtDecode } from 'jwt-decode';

import { Ability, AccessPermissionRecord, StaffRecord } from '@/common/types';
import { db } from '@/providers';

export async function getBearerToken() {
    const result = await db.tokens.where({ type: 'bearer' }).first();

    if (!result) return undefined;

    return result.token;
}

// Helper function to calculate remaining minutes from JWT
export const getLeftSessionInSeconds = async () => {
    try {
        const token = await getBearerToken();
        if (!token) return 0;

        const decoded = jwtDecode(token);
        if (!decoded.exp) return 0;

        const expiryDate = new Date(decoded.exp * 1000);
        const differenceInSeconds = Math.round(
            (expiryDate.getTime() - new Date().getTime()) / 1000
        );

        return Math.max(0, differenceInSeconds);
    } catch (err) {
        return 0;
    }
};

export async function isValidSession(jwt?: string) {
    const token = jwt || (await getBearerToken());

    if (!token) {
        return false;
    }

    try {
        const decoded = jwtDecode(token);

        if (!decoded.exp) return true;

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);

        return decoded.exp && date.valueOf() > new Date().valueOf()
            ? true
            : false;
    } catch (err) {
        return false;
    }
}

export async function getLeftSessionTimeInMinutes(jwt?: string) {
    const token = jwt || (await getBearerToken());

    if (!token) {
        return 0;
    }

    try {
        const decoded = jwtDecode(token);

        if (!decoded.exp) return 0;

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);

        const differenceInMinutes = Math.round(
            (date.getTime() - new Date().getTime()) / 60000
        );

        return differenceInMinutes < 0 ? 0 : differenceInMinutes;
    } catch (err) {
        return 0;
    }
}

export async function setBearerToken(token: string) {
    await db.tokens.put({
        type: 'bearer',
        token,
    });
}

export async function clearTokens() {
    await db.tokens.clear();
}

export async function setStaff(staff: StaffRecord) {
    await db.staffs.put(staff);
}
export async function clearStaff() {
    await db.staffs.clear();
}

export async function setUserGroups(user_groups: Array<string>) {
    await db.user_groups.bulkPut(
        user_groups.map((group_id) => ({ id: group_id }))
    );
}

export async function clearUserGroups() {
    await db.user_groups.clear();
}

export async function setAccessAbilities(
    access_ability_record: AccessPermissionRecord['access_ability']
) {
    await db.access_abilities.bulkPut(
        Object.keys(access_ability_record).map((key) => ({
            component_id: key,
            ability: access_ability_record[key],
        }))
    );
}

export async function clearAccessAbilities() {
    await db.access_abilities.clear();
}

export async function getStaff() {
    return db.staffs.limit(1).first();
}

export async function getUserGroups() {
    return (await db.user_groups.toArray()).map((entity) => entity.id);
}

export async function getAccessAbilities() {
    const toReturn: {
        [index: string]: Ability;
    } = {};

    (await db.access_abilities.toArray()).map((ability) => {
        toReturn[ability.component_id] = ability.ability;
    });

    return toReturn;
}

export async function getAccessAbleSubmoduleIds() {
    const abilities = await db.access_abilities.toArray();

    const submoduleIds = new Set<string>();

    for (const ability of abilities) {
        if (ability.ability.access_level !== 'NO_ACCESS') {
            const submoduleId = extractSubmoduleIdFromComponentId(
                ability.component_id
            );
            submoduleIds.add(submoduleId);
        }
    }

    return Array.from(submoduleIds);
}

export async function getAbilityForComponent(
    component_id: string
): Promise<Ability | undefined> {
    const ability = await db.access_abilities
        .where({
            component_id,
        })
        .first();

    if (!ability) return undefined;

    return {
        ...ability.ability,
    };
}

export async function removeBearerToken() {
    return db.tokens
        .where({
            type: 'bearer',
        })
        .delete();
}

export function extractModuleIdFromComponentId(component_id: string) {
    return component_id.split('.')[0];
}

export function extractSubmoduleIdFromComponentId(component_id: string) {
    return component_id.split('.').slice(0, 2).join('.');
}
