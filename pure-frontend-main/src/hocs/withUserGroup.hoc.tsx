import useSWR from 'swr';

import { underUserGroup } from '@/modules/acl/acl.service';

/* eslint-disable react/display-name */
export function withUserGroup<T extends { disabled?: boolean }>(
  WrappedComponent: (props: T) => JSX.Element,
  userGroupPrefix: string,
  fallback: 'hide' | 'forbidden' | 'disable' = 'hide'
) {
  return function (props: T) {
    let newProps = props;

    const { isLoading, data: hasAccess } = useSWR(
      `checkForUserGroup${userGroupPrefix}`,
      () => underUserGroup(userGroupPrefix)
    );

    if (isLoading) return null;

    if (!hasAccess && fallback === 'hide') return <></>;

    if (!hasAccess && fallback === 'forbidden')
      return (
        <div className="flex w-full h-full justify-center items-center">
          <span className="text-destructive">Permission Denied!</span>
        </div>
      );

    if (!hasAccess && fallback === 'disable') {
      newProps = {
        ...newProps,
        disabled: true,
      };
    }

    return <WrappedComponent {...newProps} />;
  };
}
