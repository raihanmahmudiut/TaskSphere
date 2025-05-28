'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import { FRONTEND_URLS } from '@/common/constants';
import { isValidSession } from '@/common/services';
import Emitter from '@/common/utils/event.utils';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import LoadingPage from '@/components/loader-page';
import SessionTimeoutDialog from '@/components/session-timeout-dialog';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useSidebar } from '@/hooks';
import { logout } from '@/modules/auth/auth.service';

type Props = {
  children: React.ReactNode;
};

function Layout(props: Props) {
  const [isSessionValid, setSessionValid] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [key, setKey] = React.useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { isOpen } = useSidebar();

  // Checking if we're coming back from a login redirect
  React.useEffect(() => {
    const isRedirect = searchParams.get('redirect') !== null;
    if (isRedirect) {
      setKey((prev) => prev + 1);
      const newParams = new URLSearchParams();

      searchParams.forEach((value, k) => {
        if (k !== 'redirect') {
          newParams.append(k, value);
        }
      });

      // Updating the URL without the redirect parameter
      const newSearch = newParams.toString();
      router.replace(`${pathname}${newSearch ? `?${newSearch}` : ''}`);
    }
  }, [pathname, searchParams, router]);

  React.useEffect(() => {
    const checkSession = async () => {
      const valid = await isValidSession();
      setSessionValid(valid);
      setLoading(false);
    };

    // Initial check
    void checkSession();

    // Check every second
    const interval = setInterval(checkSession, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleErrorEvent = (data: Anything) => {
    toast({
      title: 'Something Went Wrong!',
      description: data.message,
      variant: 'destructive',
      duration: 3000,
    });
  };

  React.useEffect(() => {
    Emitter.on('SERVER_INTERNAL_ERROR', handleErrorEvent);

    return () => {
      Emitter.off('SERVER_INTERNAL_ERROR', handleErrorEvent);
    };
  });

  if (!loading && isSessionValid) {
    return (
      <div className="mx-auto 3xl:max-w-[1920px] w-full px-4 flex">
        <Header />
        <div className="flex min-h-screen w-full">
          <Sidebar />
          <main
            className={`flex-1 overflow-y-auto overflow-x-hidden pt-28 bg-secondary/10 pb-1 px-6 mx-auto w-full z-30 transition-all duration-500 ${isOpen ? 'ml-[18rem]' : 'ml-[80px]'}`}
          >
            <div key={key}>{props.children}</div>
            <SessionTimeoutDialog />
            <Toaster />
          </main>
          <Toaster />
        </div>
      </div>
    );
  }

  if (!loading && !isSessionValid) {
    logout()
      .then(() => {
        router.push(
          `${FRONTEND_URLS.AUTH.LOGIN}?redirect=${encodeURIComponent(`${pathname}?${searchParams.toString()}`)}`
        );
      })
      .catch((err) => console.log(err));
  }

  return <LoadingPage />;
}

export function DashboardLayout(props: Props) {
  return (
    <React.Suspense fallback={<LoadingPage />}>
      <Layout {...props} />
    </React.Suspense>
  );
}
