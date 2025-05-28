import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import React, { ReactNode } from 'react';

import LoadingSpinner from '@/components/loader';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type AlertDialogComponentProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: ReactNode;
  description?: string | ReactNode;
  content?: ReactNode;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  confirmLabel?: string;
  confirmClassName?: string;
  cancelLabel?: string;
  confirmDisabled?: boolean;
  onConfirm?: () =>
    | void
    | Promise<void>
    | (() => Promise<() => void>)
    | Promise<(() => void) | undefined>;
  onCancel?: () => void | Promise<void>;
  disableCancel?: boolean;
  children?: ReactNode;
};

export const AlertDialogComponent: React.FC<AlertDialogComponentProps> = ({
  open,
  setOpen,
  title,
  description,
  content,
  headerContent,
  footerContent,
  loading = false,
  loadingText,
  confirmLabel = 'Confirm',
  confirmClassName,
  confirmDisabled = false,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  disableCancel = false,
  children,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-[500px] max-h-fit">
        {title && (
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {headerContent && <>{headerContent}</>}
          </AlertDialogHeader>
        )}
        {description && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}
        {content && <>{content}</>}
        {children}
        <AlertDialogFooter>
          {!disableCancel && (
            <AlertDialogCancel
              disabled={loading}
              onClick={onCancel || (() => setOpen(false))}
            >
              {cancelLabel}
            </AlertDialogCancel>
          )}
          {onConfirm && (
            <Button
              className={confirmClassName}
              onClick={async () => {
                await onConfirm();
              }}
              disabled={confirmDisabled || loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <LoadingSpinner />
                  <span className="ml-2">{loadingText}</span>
                </span>
              ) : (
                confirmLabel
              )}
            </Button>
          )}
          {footerContent && <>{footerContent}</>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
