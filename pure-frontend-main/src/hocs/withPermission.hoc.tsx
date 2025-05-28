import useSWR from 'swr';

import { ACCESS_LEVEL } from '@/common/constants';
import { getStaff } from '@/common/services';
import { Actions } from '@/common/types';
import { hasPermission } from '@/modules/acl/acl.service';

/* eslint-disable react/display-name */
export function withPermission<T extends { disabled?: boolean }>(
  WrappedComponent: (props: T) => JSX.Element | null,
  componentIdOrRelatedComponentId: string,
  fallback: 'hide' | 'forbidden' | 'disable' = 'hide',
  {
    action,
    actions,
    accessLevel,
  }: {
    action?: Actions;
    actions?: Actions[];
    accessLevel?: valueof<typeof ACCESS_LEVEL>;
  } = {}
) {
  return function (props: T & { lastAuthorizer?: string }) {
    const { data: currentUser } = useSWR('currentUser', () => getStaff());

    const { isLoading, data: hasAccess } = useSWR(
      `checkForPermissionOf${componentIdOrRelatedComponentId}${action ?? ''}${actions?.join('') ?? ''}${accessLevel ?? ''}${props.lastAuthorizer ?? ''}${currentUser?.id}`,
      () =>
        hasPermission(componentIdOrRelatedComponentId, {
          accessLevel,
          action,
          actions,
          lastAuthorizer: props.lastAuthorizer,
          currentUserId: currentUser?.id,
        })
    );

    if (isLoading || !currentUser) return null;
    if (!hasAccess && fallback === 'hide') return <></>;
    if (!hasAccess && fallback === 'forbidden')
      return (
        <div className="flex w-full h-full justify-center items-center">
          <span className="text-destructive">Permission Denied!</span>
        </div>
      );

    const newProps = {
      ...props,
      disabled: !hasAccess && fallback === 'disable',
    };

    return <WrappedComponent {...newProps} />;
  };
}
