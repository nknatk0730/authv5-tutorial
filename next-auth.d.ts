import { DefaultSession, User } from '@auth/core/types';
import { UserRole } from '@prisma/client';

// declare module '@auth/core/types' {
//   interface ExtendedUser extends User {
//     role: string;
//   };
// };

export type ExtendedUser = User & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module '@auth/core/types' {
  interface Session extends DefaultSession {
    user: ExtendedUser;
  };
};

declare module '@auth/core/jwt' {
  interface JWT extends DefaultJWT {
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  };
};