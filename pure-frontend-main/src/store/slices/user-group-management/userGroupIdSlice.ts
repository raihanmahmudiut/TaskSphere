import { StateCreator } from 'zustand';

type CreateGroupIdSlice = {
    groupId: string;
    setGroupId: (groupId: string) => void;
    resetGroupId: () => void;
};

const createGroupIdSlice: StateCreator<CreateGroupIdSlice> = (set) => ({
    groupId: '',
    setGroupId: (newId) => set(() => ({ groupId: newId })),
    resetGroupId: () => set({ groupId: '' }),
});

export default createGroupIdSlice;
export type { CreateGroupIdSlice };
