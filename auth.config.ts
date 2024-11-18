import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from "./schema";
import { getUserByEmail } from "./data/user";
import bcrypt from 'bcryptjs';
import Github from 'next-auth/providers/github';
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";
import { getUserById } from "./data/user";
import { db } from './lib/db';
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation';
import { getAccountByUserId } from './data/account';
 
export default {
  pages: {
    signIn: "/auth/login", // 未認証の際にリダイレクトされるカスタムログインページ
    error: "/auth/error",
  },
  providers: [
    Github,
    Google,
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
  events: {
    linkAccount: async ({ user }) => {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider !== "credentials") {
        return true;
      }

      const existingUser = await getUserById(user.id as string);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) {
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) {
          return false;
        };

        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      };

      return true;
    },
    authorized: async ({ auth, request }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
      const isAuthRoute = authRoutes.includes(nextUrl.pathname);

      if (isApiAuthRoute) {
        return true;
      }

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return true;
      }

      if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
          callbackUrl += nextUrl.search;
        };

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
      };
      
      return true;
    },
    session: async ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }
      
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      };

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email ?? '';
        session.user.isOAuth = token.isOAuth;
      };

      return session;
    },
    jwt: async ({ token }) => {
      if (!token.sub) {
        return token;
      };

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      };

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
} satisfies NextAuthConfig;