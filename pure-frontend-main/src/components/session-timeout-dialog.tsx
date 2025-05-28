import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { FRONTEND_URLS } from '@/common/constants';
import Emitter from '@/common/utils/event.utils';
import { logout } from '@/modules/auth/auth.service';

import { AlertDialogComponent } from './alert-dialog';

export default function SessionTimeoutDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const gotoLogin = async () => {
    setLoading(true);
    try {
      await logout();
      router.push(FRONTEND_URLS.AUTH.LOGIN);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionTimeout = () => {
    setOpen(true);
  };

  useEffect(() => {
    Emitter.on('SESSION_TIMEOUT', handleSessionTimeout);

    return () => {
      Emitter.off('SESSION_TIMEOUT', handleSessionTimeout);
    };
  }, []);

  return (
    <AlertDialogComponent
      open={open}
      setOpen={setOpen}
      title="Session Timeout"
      description="Session has timed out! Please login again."
      loading={loading}
      loadingText="Logging out..."
      confirmLabel="Login"
      onConfirm={gotoLogin}
    />
  );
}
