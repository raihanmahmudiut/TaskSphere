import { useEffect, useState } from 'react';

import { StaffStatus } from '@/common/constants/status.constant';

type AccessAbility = {
    access_level: string;
    can_view: boolean;
    can_insert: boolean;
    can_edit: boolean;
    can_delete: boolean;
    can_authorize: boolean;
    can_reject: boolean;
    can_submit: boolean;
};

type AccessPermission = {
    user_groups: string[];
    access_ability: {
        [key: string]: AccessAbility;
    };
};

type UserData = {
    id: string;
    avatar: string | null;
    department: string;
    designation: string;
    dob: string; // ISO date string
    email: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER'; // Adjust as needed
    last_logged_in_at: string | null; // ISO date string or null
    marital_status: string | null;
    name: string;
    nid: string;
    nid_urls: string[] | null;
    nominee_dob: string | null; // ISO date string or null
    nominee_name: string | null;
    nominee_nid: string | null;
    nominee_phone: string | null;
    password_last_changed_at: string; // ISO date string
    phone: string;
    require_password_change: boolean;
    status: valueof<typeof StaffStatus>; // Adjust as needed
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    access_permission: AccessPermission;
};

export const useCurrentUser = (): UserData | null => {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');

        if (storedUserData) {
            try {
                const parsedUserData: UserData = JSON.parse(storedUserData);
                setUserData(parsedUserData);
            } catch (error) {
                console.error('Error parsing userData:', error);
            }
        }
    }, []);

    return userData;
};
