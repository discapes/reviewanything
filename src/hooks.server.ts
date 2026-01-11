import { getDb } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Access the Hyperdrive binding from the platform object
	const connectionString = (event.platform as any)?.env?.HYPERDRIVE?.connectionString;

	// Initialize (or get) the database connection using the binding
	getDb(connectionString);

	return resolve(event);
};
