module.exports = {
	async verifyPin(ctx) {
		try {
			const { pin } = ctx.request.body;

			if (!pin) {
				return ctx.badRequest("PIN is required");
			}

			const settings = await strapi.db
				.query("api::admin-setting.admin-setting")
				.findMany({
					limit: 1,
				});

			if (!settings || settings.length === 0) {
				return ctx.internalServerError("No admin settings found");
			}

			const correctPin = settings[0].pin;

			if (pin === correctPin) {
				return ctx.send({ success: true });
			} else {
				return ctx.send({ success: false });
			}
		} catch (error) {
			console.error("PIN verification error:", error);
			return ctx.internalServerError("Server error");
		}
	},
};
