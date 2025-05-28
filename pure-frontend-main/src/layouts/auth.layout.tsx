'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { FRONTEND_URLS } from '@/common/constants';
import { isValidSession } from '@/common/services';
import LoadingPage from '@/components/loader-page';
import { useAsync } from '@/hooks';

type Props = {
  children: React.ReactNode;
};

export function Layout(props: Props) {
  const { data: isSessionValid, loading } = useAsync(() => isValidSession());
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!loading && isSessionValid) {
    router.push(
      decodeURIComponent(
        searchParams.get('redirect') || FRONTEND_URLS.DASHBOARD.HOME
      )
    );

    return;
  }

  if (!loading && !isSessionValid)
    return (
      <div
        className={
          'w-full mx-auto max-w-5xl flex justify-center justify-items-center h-screen'
        }
      >
        {props.children}
      </div>
    );

  return <LoadingPage />;
}

export function AuthLayout(props: Props) {
  return (
    <React.Suspense fallback={<LoadingPage />}>
      <Layout {...props} />
    </React.Suspense>
  );
}
