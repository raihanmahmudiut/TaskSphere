import {
    BookUser,
    User,
    UserRoundCog,
    Users,
} from 'lucide-react';

import { NavItem } from '@/common/types';

import {
    extractModuleIdFromComponentId,
    extractSubmoduleIdFromComponentId,
} from '../services/auth.service';
import { FeatureComponents } from './feature-components.constant';
import { USER_GROUPS } from './user-groups';

export const NAV_ITEMS: NavItem[] = [
    {
        id: extractModuleIdFromComponentId(
            FeatureComponents.ADMIN_MANAGEMENT.ADMIN_USER_LIST.CREATE.ID
        ),
        public: false,
        title: 'People & Permissions',
        userGroup: USER_GROUPS.Super_Admin,
        icon: UserRoundCog,
        href: '/access-manager',
        color: 'text-red-500',
        hasChildren: true,
        children: [
            {
                id: extractSubmoduleIdFromComponentId(
                    FeatureComponents.ADMIN_MANAGEMENT.ADMIN_USER_LIST.CREATE.ID
                ),
                public: false,
                userGroup: USER_GROUPS.Super_Admin,
                title: 'Staffs',
                icon: Users,
                color: 'text-blue-500',
                href: '/staffs',
            },
            {
                id: extractSubmoduleIdFromComponentId(
                    FeatureComponents.ADMIN_MANAGEMENT.USER_GROUP_LIST.CREATE.ID
                ),
                public: false,
                userGroup: USER_GROUPS.Super_Admin,
                title: 'User Groups',
                icon: BookUser,
                color: 'text-yellow-800',
                href: '/user-groups',
            },
        ],
    },
    {
        id: 'PROFILE',
        public: true,
        title: 'Profile',
        icon: User,
        href: '/profile',
        color: 'text-sky-500',
    },
];
