'use client';

import useSWR from 'swr';

import { getStaff } from '@/common/services';
import LoadingSection from '@/components/loader-section';
import { getMarketPrice } from '@/modules/finance/finance-dashboard/finance-dashboard.service';

export default function Home() {
  const { data: staff, isLoading: loadingStaff } = useSWR('fetchStaff', () =>
    getStaff()
  );
  const { data: marketPrice, isLoading: loadingPrice } = useSWR(
    'marketPrice',
    () => getMarketPrice()
  );

  if (loadingPrice || loadingStaff) return <LoadingSection />;

  return (
    <div className="flex flex-col space-y-1 justify-center items-center w-full h-[82vh] bg-home_bg_image bg-contain bg-no-repeat bg-bottom">
      <div className="text-3xl font-bold text-gray-400">
        Welcome back,{' '}
        <span className="bg-black text-white p-1">{staff?.name}</span>
      </div>
      <div className="text-4xl font-bold text-gray-400">
        Today&apos;s Gold Price:
        <span className="text-gray-600">
          {' '}
          BDT <span className="bg-red-700 text-black p-1">{marketPrice}</span>
          /Gram
        </span>
      </div>
    </div>
  );
}
