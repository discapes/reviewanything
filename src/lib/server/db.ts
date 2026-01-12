import { env } from '$env/dynamic/private';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { building } from '$app/environment';
import * as schema from './schema';

// Re-export schema for convenience
export * from './schema';

// Type for the drizzle instance with schema
export type DrizzleDB = NodePgDatabase<typeof schema>;

let db: DrizzleDB | null = null;
let client: pg.Client | null = null;
let clientConnected = false;
let cachedConnectionString: string | null = null;

export const getDb = (connectionString?: string): DrizzleDB => {
	// Use provided connection string, or cached one, or env variable
	const url = connectionString || cachedConnectionString || env.DB_URL;

	if (!url) {
		throw new Error('Database connection string not provided');
	}

	// Cache the connection string for subsequent calls
	if (connectionString) {
		cachedConnectionString = connectionString;
	}

	// Reuse if same connection string and already set up
	if (db && cachedConnectionString === url) {
		return db;
	}

	// Create new client
	client = new pg.Client({
		connectionString: url
	});
	clientConnected = false;

	db = drizzle(client, { schema, logger: true });
	cachedConnectionString = url;

	if (!building) {
		console.log('Drizzle ORM initialized!');
	}

	return db;
};

// Must be called before any queries
export const ensureConnected = async () => {
	if (client && !clientConnected) {
		await client.connect();
		clientConnected = true;
	}
};
