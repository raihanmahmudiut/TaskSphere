import { StateCreator } from 'zustand';

type CreatePopupBannerStepSlice = {
    step: number;
    increaseStep: (step: number) => void;
    decreaseStep: (step: number) => void;
    resetStep: () => void;
};

const createPopupBannerStepSlice: StateCreator<CreatePopupBannerStepSlice> = (
    set
) => ({
    step: 1,
    increaseStep: (step) => set((state) => ({ ...state, step: step + 1 })),
    decreaseStep: (step) => set((state) => ({ ...state, step: step - 1 })),
    resetStep: () => set((state) => ({ ...state, step: 1 })),
});

export default createPopupBannerStepSlice;
export type { CreatePopupBannerStepSlice };
