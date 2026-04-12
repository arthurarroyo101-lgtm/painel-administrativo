import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool }    from 'pg';
import * as schema from './schema';

/**
 * Pool de conexões PostgreSQL.
 * Lido diretamente de process.env porque este módulo é importado
 * pelo auth.ts ANTES do NestJS inicializar o ConfigService.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

/** Instância Drizzle exportada como singleton */
export const db = drizzle(pool, { schema });

export type Db = typeof db;
