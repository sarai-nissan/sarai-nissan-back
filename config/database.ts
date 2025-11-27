export default ({ env }) => {
	const client = env("DATABASE_CLIENT", "sqlite");

	console.log("DATABASE_CLIENT_HERE:", client);
	console.log("DATABASE_URL_HERE:", env("DATABASE_URL"));
	console.log("USING_SSL_HERE:", env.bool("DATABASE_SSL", false));

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
