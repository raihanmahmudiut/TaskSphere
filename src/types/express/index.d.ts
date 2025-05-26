import { User as ServiceUserType } from '../../modules/users/users.service';

type UserPayload = Omit<ServiceUserType, 'hashedPassword'>;

declare global {
  namespace Express {
    export interface User extends UserPayload {}

    export interface Request {
      user?: User; // Making it optional as it only exists after auth
    }
  }
}

export {};
