import { StateCreator } from 'zustand';

import { PopupBannerRecord } from '@/common/types';

type CreatePopupBannerSlice = {
    popupBanner: PopupBannerRecord & { image?: File };
    setPopupBanner: (data: PopupBannerRecord & { image?: File }) => void;
    resetPopupBanner: () => void;
};

const initialState: PopupBannerRecord = {
    title: '',
    description: '',
    media_alt_text: '',
    navigation_type: 'internal',
    navigation_page: '',
    media_link: '',
    is_scheduled: 0,
};

const createPopupBannerSlice: StateCreator<CreatePopupBannerSlice> = (set) => ({
    popupBanner: initialState,
    setPopupBanner: (data) =>
        set((state) => ({ popupBanner: { ...state.popupBanner, ...data } })),
    resetPopupBanner: () => set(() => ({ popupBanner: initialState })),
});

export default createPopupBannerSlice;
export type { CreatePopupBannerSlice };
