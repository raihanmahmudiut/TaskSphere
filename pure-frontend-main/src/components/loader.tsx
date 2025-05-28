import { Loader2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

const LoadingSpinner = ({
  className,
  visible = true,
}: {
  className?: string;
  visible?: boolean;
}) => {
  return (
    <>
      {typeof visible === 'boolean' && visible === false ? (
        <></>
      ) : (
        <Loader2Icon className={cn('animate-spin m-auto', className)} />
      )}
    </>
  );
};

export default LoadingSpinner;
