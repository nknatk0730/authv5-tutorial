import { PrismaClient } from '@prisma/client';

declare global {
  /* eslint-disable no-var */
  var prisma: PrismaClient | undefined;
}
/* eslint-enable no-var */

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}