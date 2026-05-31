import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This is required to make typescript happy when DATABASE_URL is not provided during build,
// though in runtime it will throw an error if missing.
const sql = neon(process.env.DATABASE_URL || 'postgres://localhost/dummy');
export const db = drizzle({ client: sql, schema });
