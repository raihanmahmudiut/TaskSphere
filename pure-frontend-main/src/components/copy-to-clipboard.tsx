import { ClipboardCopy } from 'lucide-react';

import { useToast } from './ui/use-toast';

export function CopyToClipboard({
  text,
  ignoreToast,
  className,
}: {
  text: string;
  ignoreToast?: boolean;
  className?: string;
}) {
  const { toast } = useToast();

  return (
    <ClipboardCopy
      className={`cursor-pointer text-gray-500 ${className}`}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        if (!ignoreToast) {
          toast({
            title: 'Copied Successfully!',
            description: text,
          });
        }
      }}
    />
  );
}
