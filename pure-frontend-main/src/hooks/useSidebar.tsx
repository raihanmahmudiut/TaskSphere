import { create } from 'zustand';

interface SidebarStore {
  isOpen: boolean;
  toggle: () => void;
  isHovering: boolean;
  hover: (toggle: boolean) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  isHovering: false,
  hover: (toggle: boolean) => set(() => ({ isHovering: toggle })),
}));
