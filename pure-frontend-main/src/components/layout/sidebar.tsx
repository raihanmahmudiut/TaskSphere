'use client';

import React from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import useSWR from 'swr';

import { SideNav } from '@/components/layout/side-nav';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { getAccessAbleNavItems } from '@/modules/acl/acl.service';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isOpen, toggle, isHovering, hover } = useSidebar();

  const { data: navItems } = useSWR('getNavItems', () =>
    getAccessAbleNavItems()
  );

  const handleToggle = () => {
    toggle();
  };

  return (
    <nav
      className={cn(
        'bg-white fixed hidden h-full border-r pt-20 md:block w-7 z-40',
        isOpen || isHovering ? 'w-[19rem]' : 'w-[80px]',
        'transition-all duration-500',

        // !isOpen ? "absolute" : "fixed",
        className
      )}
    >
      <BsArrowLeftShort
        className={cn(
          'absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          !isOpen && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <div
              onMouseEnter={() => hover(true)}
              onMouseLeave={() => hover(false)}
            >
              <SideNav
                className="text-foreground transition-all duration-500 z-50 ml-4 rounded p-2 opacity-100"
                items={navItems || []}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
