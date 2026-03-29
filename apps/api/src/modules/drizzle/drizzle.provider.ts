// src/modules/drizzle/drizzle.provider.ts
import {
  DRIZZLE_PROVIDER,
  NEST_DRIZZLE_OPTIONS,
} from '@app/core/constants/db.constants'; // Corrected path
import { DrizzleService } from './drizzle.service';

export const connectionFactory = {
  provide: DRIZZLE_PROVIDER,
  useFactory: async (drizzleServiceInstance: DrizzleService) => {
    return drizzleServiceInstance.getDrizzle();
  },
  inject: [DrizzleService],
};

export function createNestDrizzleProviders(
  options: /* NestDrizzleOptions */ any,
) {
  return [
    {
      provide: NEST_DRIZZLE_OPTIONS,
      useValue: options,
    },
  ];
}
