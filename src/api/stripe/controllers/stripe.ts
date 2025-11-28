"use strict";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
	async webhook(ctx) {
		const req = ctx.request;
		const signature = req.headers["stripe-signature"];

		let event;

		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				signature,
				process.env.STRIPE_WEBHOOK_SECRET
			);
		} catch (err) {
			console.error("❌ Stripe webhook signature error:", err.message);
			ctx.response.status = 400;
			return { error: `Webhook Error: ${err.message}` };
		}

		if (event.type === "checkout.session.completed") {
			const session = event.data.object;
			const metadata = session.metadata;

			await strapi.entityService.create("api::order.order", {
				data: {
					email: metadata.email,
					phone: metadata.phone,
					firstName: metadata.firstName,
					lastName: metadata.lastName,
					delivery: metadata.delivery,
					address1: metadata.address1,
					address2: metadata.address2,
					city: metadata.city,
					state: metadata.state,
					postalCode: metadata.postalCode,
					country: metadata.country,
					basket: JSON.parse(metadata.basket),
					archived: false,
					stripeSessionId: session.id,
					stripePaymentStatus: session.payment_status,
				},
			});

			console.log("✅ Order created via webhook!");
		}

		ctx.response.status = 200;
		return { received: true };
	},
};
