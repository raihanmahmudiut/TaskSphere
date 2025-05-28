export interface SubmenuItems {
    label: string;
    link: string;
}
export interface NavItems {
    label: string;
    icon: React.ReactElement | undefined;
    link: string;
    isParent: boolean;
    subMenu?: SubmenuItems[];
}
export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    menus: NavItems[];
}

import { type LucideIcon } from 'lucide-react';

export interface NavItem {
    id: string;
    userGroup?: string;
    public: boolean;
    title: string;
    href: string;
    icon: LucideIcon;
    color?: string;
    hasChildren?: boolean;
    children?: NavItem[];
}
