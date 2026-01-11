import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { building } from '$app/environment';
import * as schema from './schema';

// Re-export schema for convenience
export * from './schema';

// Type for the drizzle instance with schema
export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

let db: DrizzleDB | null = null;
let pool: Pool | null = null;

export const getDb = (connectionString?: string): DrizzleDB => {
	if (db) return db;

	// Priority: Cloudflare Hyperdrive binding > Environment variable
	const url = connectionString || env.DB_URL;

	if (!url) {
		throw new Error('Database connection string not provided');
	}

	// Create pg Pool
	pool = new Pool({
		connectionString: url,
		// For Hyperdrive, use fewer connections as it handles pooling
		max: connectionString ? 1 : 10
	});

	db = drizzle(pool, { schema, logger: true });

	if (!building) {
		console.log('Drizzle ORM initialized!');
	}

	return db;
};

// Helper to reset connection (useful for testing or connection issues)
export const resetDb = async () => {
	if (pool) {
		await pool.end();
		pool = null;
		db = null;
	}
};
