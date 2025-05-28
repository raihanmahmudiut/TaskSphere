import { StateCreator } from 'zustand';

type FilteredRecordCountSlice = {
    filteredRecordCount: string | number | undefined;
    setFilteredRecordCount: (
        filteredRecordCount: string | number | undefined
    ) => void;
    resetFilteredRecordCount: () => void;
};

const filteredRecordCountSlice: StateCreator<FilteredRecordCountSlice> = (
    set
) => ({
    filteredRecordCount: undefined,
    setFilteredRecordCount: (count) =>
        set(() => ({ filteredRecordCount: count })),
    resetFilteredRecordCount: () => set({ filteredRecordCount: undefined }),
});

export default filteredRecordCountSlice;
export type { FilteredRecordCountSlice };
