import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  disableFocus?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, children, disableFocus, ...props }, ref) => {
    // Create a wrapper ref to handle the scroll behavior
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper || type !== 'number') return;

      const preventDefault = (e: WheelEvent) => {
        e.preventDefault();
        wrapper.blur();
      };

      wrapper.addEventListener('wheel', preventDefault, { passive: false });

      return () => {
        wrapper.removeEventListener('wheel', preventDefault);
      };
    }, [type]);

    return (
      <div ref={wrapperRef} className="relative w-full">
        <input
          type={type}
          // className={cn(
          //   'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          //   className
          // )}
          
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            disableFocus ? 'focus:outline-none pointer-events-none' : 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  focus-visible:ring-offset-2 ',
            className
          )}
          ref={ref}
          {...props}
        />
        {children}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };