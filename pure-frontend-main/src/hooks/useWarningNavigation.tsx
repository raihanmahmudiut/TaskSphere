import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type NavigationState = {
  isNavigating: boolean;
  destination: string;
};

export const useUnsavedChangesWarning = (
  hasUnsavedChanges = false,
  onConfirmNavigation?: () => void
) => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isNavigating: false,
    destination: '',
  });

  const router = useRouter();

  useEffect(() => {
    if (!hasUnsavedChanges) {
      setNavigationState({ isNavigating: false, destination: '' });
    }
  }, [hasUnsavedChanges]);

  // Handle browser back/forward buttons and tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const onNavigate = useCallback(
    (destination: string) => {
      if (hasUnsavedChanges) {
        setNavigationState({
          isNavigating: true,
          destination,
        });

        return false;
      }

      return true;
    },
    [hasUnsavedChanges]
  );

  const handleConfirm = useCallback(() => {
    setNavigationState({ isNavigating: false, destination: '' });

    if (onConfirmNavigation) {
      onConfirmNavigation();
    }

    if (navigationState.destination) {
      const url = new URL(navigationState.destination, window.location.origin);

      // Small timeout to ensure state updates complete before navigation
      setTimeout(() => {
        router.push(url.pathname);
      }, 0);
    }
  }, [navigationState.destination, router, onConfirmNavigation]);

  const handleCancel = useCallback(() => {
    setNavigationState({ isNavigating: false, destination: '' });
  }, []);

  return {
    isDialogOpen: navigationState.isNavigating,
    onNavigate,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };
};
