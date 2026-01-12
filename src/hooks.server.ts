import { getDb, setDb } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const handle: Handle = async ({ event, resolve }) => {
  const env = (event.platform as any)?.env;

  // nope: 
  //         "\n\u001b[1;31m[500] GET /\u001b[0m\nError: Cannot perform I/O on behalf of a different request. I/O objects (such as streams, request/response bodies, and others) created in the context of one request handler cannot be accessed from a different request's handler. This is a limitation of Cloudflare Workers which allows us to improve overall performance. (I/O type: Writable)\n    at EventEmitter.write (functionsWorker-0.23162088603559106.js:14246:16)\n    at nextWrite (functionsWorker-0.23162088603559106.js:15230:22)\n    at functionsWorker-0.23162088603559106.js:14285:7"
  // if (!getDb()) {
  //
  console.log('Connecting to database in handle hook, connectionString length:', env?.HYPERDRIVE?.connectionString?.length);
  const sql = postgres(env.HYPERDRIVE.connectionString, {
    // Limit the connections for the Worker request to 5 due to Workers' limits on concurrent external connections
    max: 5,
    // If you are not using array types in your Postgres schema, disable `fetch_types` to avoid an additional round-trip (unnecessary latency)
    fetch_types: false,
  });
  const db = drizzle(sql);
  setDb(db);
  console.log('Database connected in handle hook');

  const response = await resolve(event);
  return response;
};
