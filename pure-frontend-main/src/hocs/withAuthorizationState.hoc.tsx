import React from 'react';
import useSWR from 'swr';

import {
  ACCESS_LEVEL,
  AUTHORIZATION_FLOW_FOR_FEATURES,
} from '@/common/constants';
import { getAbilityForComponent, getStaff } from '@/common/services';

type AccessLevel = (typeof ACCESS_LEVEL)[keyof typeof ACCESS_LEVEL];
type AuthFlowStep = AccessLevel | readonly AccessLevel[];
type FeatureComponentKey = keyof typeof AUTHORIZATION_FLOW_FOR_FEATURES;
type FallbackType = 'hide' | 'forbidden' | 'disable';

/* eslint-disable react/display-name */
export function withAuthorizationState<T extends { disabled?: boolean }>(
  WrappedComponent: (props: T) => JSX.Element | null,
  componentId: FeatureComponentKey,
  fallback: FallbackType = 'hide'
) {
  return function (
    props: T & {
      lastAuthorizer?: string;
      currentAuthorizationState?: AccessLevel | null;
    }
  ) {
    const { data: componentAccess } = useSWR(
      `getComponentAccess${componentId}`,
      () => getAbilityForComponent(componentId)
    );

    const { data: currentUser } = useSWR('currentUser', () => getStaff());

    const { data: canProceed } = useSWR(
      componentAccess && props.currentAuthorizationState !== undefined
        ? `checkAuthorizationState${props.currentAuthorizationState}${props.lastAuthorizer}${componentAccess.access_level}${currentUser?.id}`
        : null,
      async () => {
        // If undefined, always return false
        if (props.currentAuthorizationState === undefined) {
          return false;
        }

        // If no component access or current user, return false
        if (!componentAccess || !currentUser) {
          return false;
        }

        const userAccessLevel = componentAccess.access_level;

        // SUPER_USER always gets access
        if (userAccessLevel === ACCESS_LEVEL.SUPER_USER) {
          return true;
        }

        // Check if current user is the last authorizer
        if (props.lastAuthorizer === currentUser.id) {
          return false;
        }

        // Get the authorization flow for this component
        const authFlow = AUTHORIZATION_FLOW_FOR_FEATURES[componentId];

        // Special handling for null authorization state
        if (props.currentAuthorizationState === null) {
          // If null, allow access only to the first step in the authorization flow
          const firstStep = authFlow[0];

          if (Array.isArray(firstStep)) {
            return firstStep.includes(userAccessLevel);
          }

          return firstStep === userAccessLevel;
        }

        // Find the current state index in the authorization flow
        const currentIndex = authFlow.findIndex((step: AuthFlowStep) => {
          if (Array.isArray(step)) {
            return step.includes(props.currentAuthorizationState!);
          }

          return step === props.currentAuthorizationState;
        });

        // If current state not found or is the last step, deny access
        if (currentIndex === -1 || currentIndex === authFlow.length - 1) {
          return false;
        }

        // Get the next valid access levels
        const nextValidLevels = authFlow[currentIndex + 1];

        // Check if user's access level is valid for the next step
        if (Array.isArray(nextValidLevels)) {
          return nextValidLevels.includes(userAccessLevel);
        }

        return nextValidLevels === userAccessLevel;
      }
    );

    // Loading state
    if (!componentAccess || !currentUser) return null;

    // Handle fallback cases
    if (!canProceed) {
      switch (fallback) {
        case 'hide':
          return <></>;
        case 'forbidden':
          return (
            <div className="flex w-full h-full justify-center items-center">
              <span className="text-destructive">Permission Denied!</span>
            </div>
          );
        case 'disable':
          return <WrappedComponent {...props} disabled={true} />;
        default:
          return <></>;
      }
    }

    return <WrappedComponent {...props} />;
  };
}
