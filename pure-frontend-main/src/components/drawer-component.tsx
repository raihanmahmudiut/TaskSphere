import React, { ReactNode } from 'react';

import LoadingSpinner from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

type ButtonVariant =
  | 'destructive'
  | 'link'
  | 'default'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | null;

type DrawerComponentProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string | ReactNode;
  description?: string | ReactNode;
  contentClassName?: string;
  children?: React.ReactNode;
  onConfirm?: () => void | Promise<void> | Promise<(() => void) | undefined>;
  onCancel?: () => void | Promise<void> | undefined;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonVariant;
  confirmClassName?: string;
  loading?: boolean;
  loadingText?: string;
  footerContent?: ReactNode;
  disabled?: boolean;
};

const DrawerComponent: React.FC<DrawerComponentProps> = ({
  open,
  onOpenChange,
  title,
  description,
  contentClassName = '',
  children = undefined,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'destructive',
  confirmClassName,
  loading = false,
  loadingText = 'Processing...',
  footerContent,
  disabled,
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={contentClassName}>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="px-4">{children}</div>
        <DrawerFooter className="pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="w-full"
            >
              {cancelText}
            </Button>
          )}

          {onConfirm && (
            <Button
              type="button"
              className={cn('w-full', confirmClassName)}
              variant={confirmVariant}
              onClick={async () => {
                await onConfirm();
              }}
              disabled={loading || disabled}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner />
                  <span className="ml-2">{loadingText}</span>
                </span>
              ) : (
                confirmText
              )}
            </Button>
          )}
          {footerContent && <div className="w-full">{footerContent}</div>}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerComponent;
