import { CheckCircle } from 'lucide-react';
import * as React from 'react';
import useSWR from 'swr';

import { ACCESS_LEVEL, FeatureComponents } from '@/common/constants';
import { getAbilityForComponent, getStaff } from '@/common/services';
import { Badge, BadgeProps } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function getAction(status: string) {
  return status === 'REJECTED' ? 'Rejected' : 'Approved';
}

function getLabelMap(
  userIsLast: boolean,
  action: string
): Record<valueof<typeof ACCESS_LEVEL>, string> {
  return {
    MAKER: userIsLast ? 'Initiated by you' : 'Initiated by Maker',
    CHECKER: userIsLast ? `${action} by you` : `${action} by Checker`,
    AUTHORIZER_1: userIsLast ? `${action} by you` : `${action} by Authorizer 1`,
    AUTHORIZER_2: userIsLast ? `${action} by you` : `${action} by Authorizer 2`,
    AUTHORIZER_3: userIsLast ? `${action} by you` : `${action} by Authorizer 3`,
    AUTHORIZER_4: userIsLast ? `${action} by you` : `${action} by Authorizer 4`,
    SUPER_USER: userIsLast ? `${action} by you` : `${action} by Super User`,
    VIEWER: 'Viewed',
    NO_ACCESS: 'No Access',
  };
}

function getVariant(
  status: string,
  userIsLast: boolean,
  current_authorization_state: valueof<typeof ACCESS_LEVEL>,
  variantMap: Record<valueof<typeof ACCESS_LEVEL>, BadgeProps['variant']>
): BadgeProps['variant'] {
  if (status === 'REJECTED') return 'destructive';
  if (userIsLast) return 'default';

  return variantMap[current_authorization_state];
}

type TooltipParams = {
  userAccessLevel?: valueof<typeof ACCESS_LEVEL>;
  last_authorizer: string;
  currentUserID?: string;
  labelMap: Record<valueof<typeof ACCESS_LEVEL>, string>;
  feature: string;
};

function getTooltip({
  userAccessLevel,
  last_authorizer,
  currentUserID,
  feature,
}: TooltipParams): string {
  if (!userAccessLevel) return '';

  if (['MAKER', 'CHECKER'].includes(userAccessLevel)) {
    return `This ${feature} was authorized by ${userAccessLevel}`;
  }

  if (
    userAccessLevel.startsWith('AUTHORIZER') ||
    userAccessLevel === 'SUPER_USER'
  ) {
    return last_authorizer === currentUserID
      ? `This ${feature} was authorized by you`
      : `This ${feature} was authorized by another user`;
  }

  return '';
}

interface AuthStateProps {
  last_authorizer: string;
  current_authorization_state: valueof<typeof ACCESS_LEVEL>;
  status: string;
  componentIDString: string;
  feature: string;
}

export const AuthState = ({
  last_authorizer,
  current_authorization_state,
  status,
  componentIDString,
  feature,
}: AuthStateProps) => {
  const { data: staff } = useSWR('fetchStaff', () => getStaff());
  const { data: componentAccess } = useSWR(
    `getComponentAccess${componentIDString}`,
    () =>
      getAbilityForComponent(
        componentIDString as keyof typeof FeatureComponents
      )
  );

  const userAccessLevel = componentAccess?.access_level;
  const currentUserID = staff?.id;
  const userIsLast = last_authorizer === currentUserID;
  const action = getAction(status);

  const labelMap = getLabelMap(userIsLast, action);

  const variantMap: Record<
    valueof<typeof ACCESS_LEVEL>,
    BadgeProps['variant']
  > = {
    MAKER: 'outline',
    CHECKER: 'sunny',
    AUTHORIZER_1: 'success',
    AUTHORIZER_2: 'success',
    AUTHORIZER_3: 'success',
    AUTHORIZER_4: 'success',
    SUPER_USER: 'success',
    VIEWER: 'secondary',
    NO_ACCESS: 'secondary',
  };

  const variant = getVariant(
    status,
    userIsLast,
    current_authorization_state,
    variantMap
  );
  const tooltipText = getTooltip({
    userAccessLevel,
    last_authorizer,
    currentUserID,
    labelMap,
    feature,
  });

  return (
    <div className="flex items-center gap-1 w-fit whitespace-nowrap text-center">
      {userIsLast && tooltipText && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CheckCircle className="mr-2 w-4 h-4 text-green-600" />
            </TooltipTrigger>
            <TooltipContent>{tooltipText}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Badge variant={variant}>{labelMap[current_authorization_state]}</Badge>
    </div>
  );
};
