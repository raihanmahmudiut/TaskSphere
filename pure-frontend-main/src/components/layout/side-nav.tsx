'use client';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { FRONTEND_URLS } from '@/common/constants';
import { NavItem } from '@/common/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/layout/side-nav-accordion';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebar } from '@/hooks/useSidebar';
import { useUnsavedChangesWarning } from '@/hooks/useWarningNavigation';
import { cn } from '@/lib/utils';
import useStore from '@/store/useStore';

import { UnsavedChangesDialog } from '../navigation-warning-dialog';

type Props = {
  items: NavItem[];
  setOpen?: (open: boolean) => void;
  className?: string;
};

export function SideNav({ items, setOpen, className }: Props) {
  const path = usePathname();
  const { isOpen, isHovering } = useSidebar();
  const [activeMenu, setActiveMenu] = useState('');
  const [activeSubMenu, setActiveSubMenu] = useState('');

  const setHasUnsavedChanges = useStore((state) => state.setHasUnsavedChanges);
  const hasUnsavedChanges = useStore((state) => state.hasUnsavedChanges);

  const { isDialogOpen, onNavigate, onConfirm, onCancel } =
    useUnsavedChangesWarning(hasUnsavedChanges, () => {
      setHasUnsavedChanges(false);
    });

  const isPathInItemChildren = useCallback(
    (_path: string, children: NavItem[]) => {
      for (let j = 0; j < children.length; j++) {
        const it = children[j];
        if (it.href.startsWith(`/${_path.split('/')[1]}`)) {
          return j;
        }
      }

      return -1;
    },
    []
  );

  const handleActiveMenuIndicator = useCallback(
    (_path: string, _items: NavItem[]) => {
      if (_path === FRONTEND_URLS.DASHBOARD.HOME) {
        setActiveMenu('');
        setActiveSubMenu('');

        return;
      }

      for (let i = 0; i < _items.length; i++) {
        const item = _items[i];
        if (item.hasChildren && item.children) {
          const index = isPathInItemChildren(_path, item.children);
          if (index !== -1) {
            setActiveMenu(item.title);
            setActiveSubMenu(item.children[index].title);
            break;
          }
        } else if (item.href.startsWith(`/${_path.split('/')[1]}`)) {
          setActiveMenu(item.title);
          setActiveSubMenu('');
          break;
        }
      }
    },
    [isPathInItemChildren]
  );

  useEffect(() => {
    handleActiveMenuIndicator(path, items);
  }, [path, items, handleActiveMenuIndicator]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      onNavigate(e.currentTarget.href);
    } else if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <ScrollArea
      type="hover"
      scrollHideDelay={400}
      className="h-[calc(100vh-150px)]"
    >
      <nav className="space-y-2">
        <Accordion type="single" collapsible className="space-y-2">
          {items.map((item) =>
            item.hasChildren ? (
              <AccordionItem
                value={item.title}
                className="border-none"
                key={item.id}
              >
                <AccordionTrigger
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'group relative flex h-12 justify-between px-4 text-base font-light duration-500 hover:bg-muted hover:no-underline',
                    activeMenu === item.title && 'font-bold'
                  )}
                >
                  <div>
                    <item.icon
                      className={cn(
                        'h-5 w-5',
                        item.color,
                        activeMenu === item.title && 'border-b-2'
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      'w-56 absolute left-8 text-base duration-500',
                      className
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span>{item.title}</span>
                      <span>
                        <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-500" />
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="mt-2 space-y-1 pb-1 transition-all duration-500">
                  {item.children?.map((child) => (
                    <Link
                      key={child.title}
                      href={child.href}
                      onClick={handleLinkClick}
                      className={cn(
                        buttonVariants({
                          variant: 'ghost',
                        }),
                        'group relative font-extralight flex h-12 justify-start gap-x-3',
                        isOpen || isHovering ? 'pl-8' : 'pl-4',
                        activeSubMenu === child.title &&
                          'bg-muted font-medium hover:bg-muted',
                        'transition-all duration-300'
                      )}
                    >
                      <child.icon className={cn('h-5 w-5', child.color)} />
                      <span
                        className={cn(
                          'absolute left-12 text-sm text-gray-600 duration-300 ml-4',
                          className
                        )}
                      >
                        {child.title}
                      </span>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ) : (
              <Link
                key={item.title}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'group relative flex h-12 justify-start font-light',
                  activeMenu === item.title &&
                    'bg-muted font-bold hover:bg-muted'
                )}
              >
                <item.icon className={cn('h-5 w-5', item.color)} />
                <span
                  className={cn(
                    'absolute left-8 text-base duration-300',
                    className
                  )}
                >
                  {item.title}
                </span>
              </Link>
            )
          )}
        </Accordion>
      </nav>
      <UnsavedChangesDialog
        isOpen={isDialogOpen}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </ScrollArea>
  );
}
