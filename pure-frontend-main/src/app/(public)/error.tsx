'use client';

import ErrorPage from '@/components/error';

export default function Error({
  error,
  reset,
}: {
  error: string | (Error & { digest?: string });
  reset: () => void;
}) {
  return <ErrorPage error={error} reset={reset} persistOnLocalStorage={true} />;
}
