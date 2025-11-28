module.exports = (config, { strapi }) => {
	return async (ctx, next) => {
		if (ctx.request.url.startsWith("/api/stripe/webhook")) {
			const raw = await new Promise((resolve) => {
				let data = "";
				ctx.req.on("data", (chunk) => {
					data += chunk;
				});
				ctx.req.on("end", () => resolve(data));
			});

			ctx.request.body = raw;
		}

		await next();
	};
};
