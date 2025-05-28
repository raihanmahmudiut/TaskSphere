import { StateCreator } from 'zustand';

type CreatePopupBannerSubmitFormSlice = {
    isSubmitted: boolean;
    onSubmit: (isSubmitted: boolean) => void;
    resetIsSubmitted: () => void;
};

const createPopupBannerSubmitFormSlice: StateCreator<
    CreatePopupBannerSubmitFormSlice
> = (set) => ({
    isSubmitted: false,
    onSubmit: () =>
        set((state) => ({ ...state, isSubmitted: !state.isSubmitted })),
    resetIsSubmitted: () => set((state) => ({ ...state, isSubmitted: false })),
});

export default createPopupBannerSubmitFormSlice;
export type { CreatePopupBannerSubmitFormSlice };
