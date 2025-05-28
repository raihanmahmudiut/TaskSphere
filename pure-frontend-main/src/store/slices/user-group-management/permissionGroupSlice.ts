import { StateCreator } from 'zustand';

import { PermissionGroupRecord } from '@/common/types';

type PermissionGroupSlice = {
    permissionGroup: PermissionGroupRecord[];
    setPermissionGroup: (permissionGroup: PermissionGroupRecord[]) => void;
    resetPermissionGroup: () => void;
};

const permissionGroupSlice: StateCreator<PermissionGroupSlice> = (set) => ({
    permissionGroup: [],
    setPermissionGroup: (newList: PermissionGroupRecord[]) =>
        set(() => ({ permissionGroup: newList })),
    resetPermissionGroup: () => set({ permissionGroup: [] }),
});

export default permissionGroupSlice;
export type { PermissionGroupSlice };
