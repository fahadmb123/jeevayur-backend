import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';
import { env } from '../../config/environment.config.js';

const adapter = new PrismaLibSQL({
  url: env.databaseUrl,
  authToken: env.tursoAuthToken,
});

export const db = new PrismaClient({ adapter });
export default db;

