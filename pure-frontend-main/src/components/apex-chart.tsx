import dynamic from 'next/dynamic';

import LoadingSpinner from './loader';

export const ApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[450px] m-auto">
      <LoadingSpinner className="m-auto w-[60px] h-[60px]" />
    </div>
  ),
});
