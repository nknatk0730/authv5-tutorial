// import { User } from '@auth/core/types';
import { DefaultSession } from '@auth/core/types';
import { DefaultJWT } from 'next-auth/jwt';

// declare module '@auth/core/types' {
//   interface ExtendedUser extends User {
//     requiredId: string;
//   }
// }

declare module '@auth/core/types' {
  interface Session extends DefaultSession {
    user: {
      role: string;
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT extends DefaultJWT {
    role: string;
  }
}


