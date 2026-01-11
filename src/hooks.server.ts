import { getDataSource } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Access the Hyperdrive binding from the platform object
  const connectionString = (event.platform as any)?.env?.HYPERDRIVE?.connectionString;

  // Initialize (or get) the data source using the binding
  await getDataSource(connectionString);

  return resolve(event);
};
