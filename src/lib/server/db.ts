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

export const AppDataSource = new DataSource({
	type: 'postgres',
	url: env.DB_URL,
	logging: true,
	synchronize: true,
	entities: [Review, Like]
});

if (!building) {
	await AppDataSource.initialize()
		.then(() => {
			console.log('Data Source has been initialized!');
		})
		.catch((err) => {
			console.error('Error during Data Source initialization');
			throw err;
		});
}

// this makes devalue (svelte's serialize accept our objects)
export function pojoize<T>(o: T) {
	Object.setPrototypeOf(o, Object.prototype);
	return o;
}
