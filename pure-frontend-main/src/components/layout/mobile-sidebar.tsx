'use client';

import { MenuIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { NAV_ITEMS } from '@/common/constants';
import { SideNav } from '@/components/layout/side-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const MobileSidebar = () => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div className="flex items-center justify-center gap-2">
            <MenuIcon />
            <h1 className="text-lg font-semibold">T3 app template</h1>
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="px-1 py-6 pt-16">
            <SideNav items={NAV_ITEMS} setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
