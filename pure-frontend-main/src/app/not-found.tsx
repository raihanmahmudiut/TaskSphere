'use client';

import './not-found.css';

import { Chivo } from 'next/font/google';
import Link from 'next/link';

const chivo = Chivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chivo',
});

export default function Component() {
  return (
    <div
      className={`flex h-[100dvh] w-full flex-col items-center justify-center gap-6 px-4 md:px-6 ${chivo.variable}`}
    >
      <div className="space-y-2 text-center">
        <h1 className="text-8xl font-bold tracking-tighter sm:text-9xl">404</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Oops, the page you were looking for doesn&apos;t exist.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
        prefetch={false}
      >
        Go Back Home
      </Link>
    </div>
  );
}
