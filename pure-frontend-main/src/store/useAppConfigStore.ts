import { create } from 'zustand';

import { getAppConfig } from '@/modules/application-settings/application-settings.services';
import { ConfigFormData } from '@/modules/application-settings/application-settings.type';

interface AppConfigState {
    appConfig: ConfigFormData | null;
    isLoading: boolean;
    error: Error | null;
    fetchAppConfig: () => Promise<void>;
    refreshConfig: () => Promise<void>;
    initialized: boolean;
}

export const useAppConfigStore = create<AppConfigState>((set) => ({
    appConfig: null,
    isLoading: false,
    error: null,
    initialized: false,

    fetchAppConfig: async () => {
        const state = useAppConfigStore.getState();
        if (state.initialized || state.isLoading) {
            return;
        }

        set({ isLoading: true });
        try {
            const data = await getAppConfig();
            set({ appConfig: data, error: null, initialized: true });
        } catch (err) {
            set({
                error:
                    err instanceof Error
                        ? err
                        : new Error('Failed to fetch app config'),
                initialized: true,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    refreshConfig: async () => {
        set({ isLoading: true });
        try {
            const data = await getAppConfig();
            set({ appConfig: data, error: null });
        } catch (err) {
            set({
                error:
                    err instanceof Error
                        ? err
                        : new Error('Failed to fetch app config'),
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));
