import { User as ServiceUserType } from '../../modules/users/users.service';

type UserPayload = Omit<ServiceUserType, 'hashedPassword'>;

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface User extends UserPayload {}

    export interface Request {
      user?: User;
    }
  }
}

export {};
