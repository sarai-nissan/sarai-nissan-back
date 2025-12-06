"use strict";

const axios = require("axios");

module.exports = {
	async send(ctx) {
		const { trackingNumber, email } = ctx.request.body;

		// Basic validation
		if (!trackingNumber || !email) {
			return ctx.badRequest("trackingNumber and email are required.");
		}

		// Log request (create entry in tracking-requests)
		const logEntry = await strapi.entityService.create(
			"api::tracking-request.tracking-request" as any,
			{
				data: {
					trackingNumber,
					email,
					stat: "processing",
					sentAt: new Date(),
				},
			}
		);

		// Prepare message text
		const message = `
Hello!

Your tracking number: ${trackingNumber}

We have received your request and will process it soon.

Best regards,
Your Support Team
    `;

		try {
			// Send email through Resend
			await axios.post(
				"https://api.resend.com/emails",
				{
					from: "Field-2 <help@sarainissan.com>",
					to: email,
					subject: "Field 1",
					text: message,
				},
				{
					headers: {
						Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
						"Content-Type": "application/json",
					},
				}
			);

			// Update log entry
			await strapi.entityService.update(
				"api::tracking-request.tracking-request" as any,
				logEntry.id,
				{
					data: { stat: "sent" },
				}
			);

			return { ok: true };
		} catch (err) {
			console.error("Resend error:", err.response?.data || err);

			// Update log entry
			await strapi.entityService.update(
				"api::tracking-request.tracking-request" as any,
				logEntry.id,
				{
					data: { stat: "failed" },
				}
			);

			return ctx.internalServerError("Email sending failed.");
		}
	},
};
