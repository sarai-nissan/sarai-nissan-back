module.exports = () => {
	return async (ctx, next) => {
		if (ctx.request.url.startsWith("/api/stripe/webhook")) {
			const chunks = [];

			await new Promise((resolve) => {
				ctx.req.on("data", (chunk) => chunks.push(chunk));
				ctx.req.on("end", () => resolve());
			});

			ctx.request.body = Buffer.concat(chunks);
		}

		await next();
	};
};
