export default ({ env }) => {
	const client = env("DATABASE_CLIENT", "sqlite");
	return {
		connection: {
			client,
			connection:
				client === "sqlite"
					? { filename: env("DATABASE_FILENAME", "./data/database.sqlite") }
					: {
							connectionString: env("DATABASE_URL"),
							ssl: env.bool("DATABASE_SSL", false)
								? { rejectUnauthorized: false }
								: false,
						},
			useNullAsDefault: client === "sqlite",
			debug: false,
		},
	};
};
