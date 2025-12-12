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

		const carrier = "USPS";
		const trackingLink = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;

		const message = `
Hello,

Your order has officially begun its journey to you.

Here are your shipping details:
Order Number: ${trackingNumber}
Tracking Link: ${trackingLink}
Carrier: ${carrier}

If you have any questions or need help with anything at all, please contact sarainissanhelp@gmail.com

Thank you endlessly for supporting my art and my work. I hope your new piece brings a little more light into your space.

Sarai
`;

		try {
			// Send email through Resend
			await axios.post(
				"https://api.resend.com/emails",
				{
					from: "Shop Sarai Nissan <help@sarainissan.com>",
					to: email,
					subject: "Your Order Is On Its Way",
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
