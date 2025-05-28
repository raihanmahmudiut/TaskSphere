import { create } from 'zustand';

import {
    createDisbursementSettingsSlice,
    createGroupIdSlice,
    createPopupBannerSlice,
    createPopupBannerStepSlice,
    createPopupBannerSubmitFormSlice,
    filteredRecordCountSlice,
} from './slices';
import createformChangesSlice, {
    FormChangesSlice,
} from './slices/form-changes/formChangesSlice';
import { CreatePopupBannerSlice } from './slices/popup-management/createPopupBannerSlice';
import { CreatePopupBannerStepSlice } from './slices/popup-management/createPopupBannerStepSlice';
import { CreatePopupBannerSubmitFormSlice } from './slices/popup-management/createPopupBannerSubmitFormSlice';
import { FilteredRecordCountSlice } from './slices/record-filter/filteredRecordCountSlice';
import { DisbursementSettingsSlice } from './slices/refund-disbursement/disbursementSettingsSlice';
import componentListSlice, {
    ComponentListSlice,
} from './slices/user-group-management/componentListSlice';
import permissionGroupSlice, {
    PermissionGroupSlice,
} from './slices/user-group-management/permissionGroupSlice';
import { CreateGroupIdSlice } from './slices/user-group-management/userGroupIdSlice';

const useStore = create<
    CreatePopupBannerSlice &
        CreatePopupBannerStepSlice &
        CreatePopupBannerSubmitFormSlice &
        CreateGroupIdSlice &
        ComponentListSlice &
        PermissionGroupSlice &
        FilteredRecordCountSlice &
        DisbursementSettingsSlice &
        FormChangesSlice
>()((...a) => ({
    ...createPopupBannerSlice(...a),
    ...createPopupBannerStepSlice(...a),
    ...createPopupBannerSubmitFormSlice(...a),
    ...createGroupIdSlice(...a),
    ...componentListSlice(...a),
    ...permissionGroupSlice(...a),
    ...filteredRecordCountSlice(...a),
    ...createDisbursementSettingsSlice(...a),
    ...createformChangesSlice(...a),
}));

export default useStore;
