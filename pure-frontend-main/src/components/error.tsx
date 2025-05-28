'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
  persistOnLocalStorage = false,
}: {
  error?: string | (Error & { digest?: string });
  reset?: () => void;
  persistOnLocalStorage?: boolean;
}) {
  useEffect(() => {
    persistOnLocalStorage &&
      localStorage.setItem(
        `error-${Date.now()}`,
        JSON.stringify({
          route: window.location.href,
          error:
            typeof error === 'object' && !Array.isArray(error)
              ? JSON.stringify(error, Object.getOwnPropertyNames(error))
              : error,
        })
      );
  }, [error, persistOnLocalStorage]);

  return (
    <div className="w-full flex flex-col items-center justify-center justify-items-center gap-4 h-full">
      <div className="flex flex-col items-center justify-center text-center">
        <AlertTriangleIcon className="h-14 w-14" />
        <h1 className="text-3xl font-bold tracking-tighter">
          Something went wrong
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Don&apos;t worry, we&apos;ll take care of it.
        </p>
      </div>
      <div className="w-full max-w-sm">
        <Button
          className="w-full justify-center"
          variant="outline"
          onClick={() => (reset ? reset() : location.reload())}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}

function AlertTriangleIcon(props: Anything) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="red"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
