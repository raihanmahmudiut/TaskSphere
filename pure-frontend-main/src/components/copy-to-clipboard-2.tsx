import { Check, Copy } from 'lucide-react';
import { ReactNode, useState } from 'react';

import { Button } from './ui/button';

export function CopyToClipboard2({
  text,
  children,
  className,
}: {
  text: string | undefined | null;
  children?: ReactNode;
  className?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div
      className={`p-0 m-0 border-0 group flex items-center gap-1 ${className}`}
      onMouseLeave={() => {
        setIsCopied(false);
      }}
    >
      {children}
      {!isCopied ? (
        <Button
          size="icon"
          variant="outline"
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
          onClick={async () => {
            setIsCopied(true);
            if (text) {
              await navigator.clipboard.writeText(text);
            }
          }}
        >
          <Copy className="h-3 w-3" />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="outline"
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
        >
          <Check className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
