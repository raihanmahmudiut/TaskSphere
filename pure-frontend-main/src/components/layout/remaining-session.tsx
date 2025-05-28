import { cn } from '@/lib/utils';

import { Badge } from '../ui/badge';

function format(totalSeconds: number) {
  if (totalSeconds <= 0) return '0h 0m 0s';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

export default function RemainingSession({ seconds }: { seconds: number }) {
  return (
    <Badge
      className={cn('w-24 flex justify-center', {
        'bg-green-600': seconds >= 3600,
        'bg-yellow-600': seconds < 3600 && seconds >= 1200,
        'bg-red-600': seconds < 1200,
      })}
    >
      {format(seconds)}
    </Badge>
  );
}
