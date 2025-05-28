import { StateCreator } from 'zustand';

import { DisbursementSettingsCardProps } from '@/modules/finance/finance-refund/finance-refund.types';

interface DisbursementSettingsSlice {
    disbursementSettings: DisbursementSettingsCardProps;
    setDisbursementSettings: (settings: DisbursementSettingsCardProps) => void;
}

const createDisbursementSettingsSlice: StateCreator<
    DisbursementSettingsSlice
> = (set: (partial: Partial<DisbursementSettingsSlice>) => void) => ({
    disbursementSettings: {
        is_bkash_disbursement_active: true,
        bkash_vault_available_balance: 3,
    },
    setDisbursementSettings: (settings) =>
        set({ disbursementSettings: settings }),
});

export default createDisbursementSettingsSlice;

export type { DisbursementSettingsSlice };
