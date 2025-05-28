import { RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import Logo from '@/assets/images/logo-vault.png';
import { FeatureComponents, FRONTEND_URLS } from '@/common/constants';
import { getLeftSessionInSeconds, getStaff } from '@/common/services';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { UserNav } from '@/components/layout/user-nav';
import { Button } from '@/components/ui/button';
import { getEnvironment } from '@/config';
import { withPermission } from '@/hocs';
import { cn } from '@/lib/utils';
import { useAppConfigStore } from '@/store/useAppConfigStore';

import { Badge } from '../ui/badge';
import RemainingSession from './remaining-session';

const BypassModeContainer = () => {
  const { appConfig, isLoading, fetchAppConfig, refreshConfig } =
    useAppConfigStore();

  useEffect(() => {
    if (!appConfig && !isLoading) {
      void fetchAppConfig();
    }
  }, [appConfig, isLoading, fetchAppConfig]);

  if (!appConfig) return null;

  // Only show badge if bypass mode is active
  if (!appConfig.IS_BYPASS_MODE_ACTIVE) return null;

  return (
    <Badge
      variant="success"
      className="mr-2 bg-green-500/10 text-green-500 border-green-500/20"
    >
      Bypass Mode Active
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'ml-2 h-8 w-8 rounded-full p-0',
          'bg-green-500/10 text-green-500 border-green-500/20',
          isLoading && 'animate-spin'
        )}
        onClick={() => void refreshConfig()}
        disabled={isLoading}
      >
        <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
      </Button>
    </Badge>
  );
};

const BypassModeContainerWithPermission = withPermission(
  BypassModeContainer,
  FeatureComponents.ADMIN_MANAGEMENT.ADMIN_USER_LIST.CREATE.ID,
  'hide',
  { action: 'can_insert' }
);

const EnvironmentBadge = () => {
  const env = getEnvironment();
  if (env === 'production' || !env) return null;

  const colors = {
    development: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    staging: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  return (
    <Badge className={cn('mr-2', colors[env])}>
      {env.charAt(0).toUpperCase() + env.slice(1)}
    </Badge>
  );
};

export default function Header(): JSX.Element {
  const { data: staff } = useSWR('fetchStaff', () => getStaff());
  const [sessionTimeSeconds, setSessionTimeSeconds] = useState<number | null>(
    null
  );

  useEffect(() => {
    const initializeTimer = async (): Promise<void> => {
      try {
        const remainingSeconds = await getLeftSessionInSeconds();
        setSessionTimeSeconds(remainingSeconds);
      } catch (error) {
        console.error('Failed to get session time:', error);
      }
    };

    void initializeTimer();

    const interval = setInterval(() => {
      setSessionTimeSeconds((prevSeconds) => {
        if (prevSeconds === null) return null;
        if (prevSeconds <= 0) {
          clearInterval(interval);

          return 0;
        }

        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const router = useRouter();

  const gotoLoginPage = (): void => {
    router.push(FRONTEND_URLS.AUTH.LOGIN);
  };

  return (
    <div className="supports-backdrop-blur:bg-background/60 mx-auto 3xl:max-w-[1920px] fixed left-0 right-0 top-0 z-50 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-16 items-center justify-between px-4">
        <Link
          href={'/'}
          className="hidden items-center justify-between gap-2 md:flex"
        >
          <Image src={Logo} alt="" width={30} height={30} />
          <h1 className="text-lg font-semibold text-yellow-500">Gold Kinen</h1>
          <EnvironmentBadge />
        </Link>

        <div className={cn('block md:!hidden')}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <BypassModeContainerWithPermission />

          {sessionTimeSeconds !== null && (
            <RemainingSession seconds={sessionTimeSeconds} />
          )}
          {staff ? (
            <UserNav user={staff} />
          ) : (
            <Button size="sm" onClick={gotoLoginPage}>
              Sign In
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}
