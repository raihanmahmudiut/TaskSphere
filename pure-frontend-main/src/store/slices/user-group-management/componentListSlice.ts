import { StateCreator } from 'zustand';

import { ComponentsRecord } from '@/common/types';

type ComponentListSlice = {
    componentsList: ComponentsRecord[];
    setComponentsList: (componentsList: ComponentsRecord[]) => void;
    resetComponentsList: () => void;
};

const componentListSlice: StateCreator<ComponentListSlice> = (set) => ({
    componentsList: [],
    setComponentsList: (newList: ComponentsRecord[]) =>
        set(() => ({ componentsList: newList })),
    resetComponentsList: () => set({ componentsList: [] }),
});

export default componentListSlice;
export type { ComponentListSlice };
