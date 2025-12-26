import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Neon serverless configuration
if (process.env.NODE_ENV === 'development') {
    neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL;

/**
 * Raw Database Pool for Neon (Serverless/Node runtime compatible)
 * Use this for raw SQL queries if Prisma is not sufficient.
 */
export const db = new Pool({ connectionString });

export async function query(text: string, params?: any[]) {
    const start = Date.now();
    const res = await db.query(text, params);
    const duration = Date.now() - start;
    // console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
}
