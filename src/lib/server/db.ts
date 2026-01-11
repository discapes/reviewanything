import { env } from '$env/dynamic/private';
import { BaseEntity, DataSource, Entity, PrimaryColumn } from 'typeorm';
import { browser, building, dev, version } from '$app/environment';

@Entity()
export class Review extends BaseEntity {
  @PrimaryColumn('uuid', { default: () => 'gen_random_uuid()' })
  uuid!: string;
  @PrimaryColumn('text')
  author!: string;
  @PrimaryColumn('text')
  subject!: string;
  @PrimaryColumn('text')
  text!: string;
  @PrimaryColumn('timestamptz', { default: () => 'now()' })
  date!: Date;
  total_likes!: number;
  is_liked!: boolean;
}

@Entity()
export class Like extends BaseEntity {
  @PrimaryColumn('uuid')
  user_uuid!: string;
  @PrimaryColumn('uuid')
  review_uuid!: string;
}

//https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221GR56bhA2O9UruC4qC3cHO6cYAsqlFHY3%22%5D,%22action%22:%22open%22,%22userId%22:%22113480972864582475662%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing
//

let dataSource: DataSource;

export const getDataSource = async (connectionString?: string) => {
  // 1. Return existing initialized source if available
  if (dataSource?.isInitialized) return dataSource;

  // 2. Determine connection string: 
  // Priority: Cloudflare Binding > Dynamic Env Var
  const url = connectionString || env.DB_URL;

  dataSource = new DataSource({
    type: 'postgres',
    url: url,
    logging: true,
    synchronize: true, // Note: Consider migrations for production
    entities: [Review, Like],
    // Optional: Cloudflare works best with 'pg' driver
  });

  if (!building) {
    await dataSource.initialize();
    console.log('Data Source initialized!');
  }

  return dataSource;
};

// For non-Cloudflare environments (dev/Node), auto-init on load
if (!building && !import.meta.env.SSR) {
  // This allows it to work exactly like your current code in local node dev
  getDataSource().catch(err => console.error("Initial connection failed", err));
}

// this makes devalue (svelte's serialize accept our objects)
export function pojoize<T>(o: T) {
  Object.setPrototypeOf(o, Object.prototype);
  return o;
}
