module.exports = (config, { strapi }) => {
	return async (ctx, next) => {
		if (ctx.request.url.startsWith("/api/stripe/webhook")) {
			const chunks: Buffer[] = [];

			await new Promise<void>((resolve) => {
				ctx.req.on("data", (chunk) => chunks.push(chunk));
				ctx.req.on("end", () => resolve());
			});

			ctx.request.body = Buffer.concat(chunks);
		}

		await next();
	};
};
