'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { FRONTEND_URLS } from '@/common/constants';
import { StaffRecord } from '@/common/types';
import { UserAvatar } from '@/components/layout/user-avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/modules/auth/auth.service';
import useStore from '@/store/useStore';

type Props = {
  user: StaffRecord;
};

export function UserNav({ user }: Props) {
  const router = useRouter();
  const setHasUnsavedChanges = useStore((state) => state.setHasUnsavedChanges);

  const signOut = async () => {
    await logout();
    setHasUnsavedChanges(false);
    router.push(FRONTEND_URLS.AUTH.LOGIN);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name || '' }}
          className="h-8 w-8 cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-4 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button variant="outline" className="w-full" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Log Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
