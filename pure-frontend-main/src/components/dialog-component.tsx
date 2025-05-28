import React, { ReactNode } from 'react';

import LoadingSpinner from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const BUTTON_VARIANTS = {
  DESTRUCTIVE: 'destructive',
  LINK: 'link',
  DEFAULT: 'default',
  OUTLINE: 'outline',
  SECONDARY: 'secondary',
  GHOST: 'ghost',
} as const;

export type ButtonVariant =
  | (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS]
  | null;

type DialogComponentProps = {
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

const DialogComponent: React.FC<DialogComponentProps> = ({
  open,
  onOpenChange,
  title,
  description,
  contentClassName = 'min-w-[400px] max-h-[700px] overflow-hidden',
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
          )}

          {onConfirm && (
            <Button
              type="button"
              className={confirmClassName}
              variant={confirmVariant}
              onClick={async () => {
                await onConfirm();
              }}
              disabled={loading || disabled}
            >
              {loading ? (
                <span className="flex items-center">
                  <LoadingSpinner />
                  <span className="ml-2">{loadingText}</span>
                </span>
              ) : (
                confirmText
              )}
            </Button>
          )}
          {footerContent && <>{footerContent}</>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;
