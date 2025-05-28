import { StateCreator } from 'zustand';

interface FormChangesSlice {
    hasUnsavedChanges: boolean;
    setHasUnsavedChanges: (hasChanges: boolean) => void;
}

const createformChangesSlice: StateCreator<FormChangesSlice> = (set) => ({
    hasUnsavedChanges: false,
    setHasUnsavedChanges: (hasChanges) =>
        set({ hasUnsavedChanges: hasChanges }),
});

export default createformChangesSlice;

export type { FormChangesSlice };
