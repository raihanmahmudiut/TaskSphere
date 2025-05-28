import DexieCore, { Table } from 'dexie';

import { Ability, StaffRecord } from '@/common/types';

const DB_NAME = 'goldkinen:dashboard';

export class Dexie extends DexieCore {
    staffs!: Table<StaffRecord>;
    tokens!: Table<{
        type: 'bearer' | 'refresh';
        token: string;
    }>;
    access_abilities!: Table<{
        component_id: string;
        ability: Ability;
    }>;
    user_groups!: Table<{
        id: string;
    }>;

    constructor() {
        super(DB_NAME);
        this.version(1).stores({
            staffs: '++record_uid, id', // Primary key and indexed props
            tokens: '++type',
            access_abilities: '++component_id',
            user_groups: '++id',
        });
    }
}

export const db = new Dexie();
