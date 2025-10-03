import Stripe from "stripe";
import { Context } from "koa";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: "2025-08-27.basil",
});

export default {
	async create(ctx: Context) {
		try {
			const { basketItems, email, shippingCost, taxAmount } = ctx.request.body;

			const session = await stripe.checkout.sessions.create({
				mode: "payment",
				line_items: [
					...basketItems.map(
						(item: { name: string; price: number; quantity: number }) => ({
							price_data: {
								currency: "usd",
								product_data: {
									name: item.name,
								},
								unit_amount: item.price,
							},
							quantity: item.quantity,
						})
					),
					{
						price_data: {
							currency: "usd",
							product_data: { name: "Shipping" },
							unit_amount: shippingCost || 0,
						},
						quantity: 1,
					},
					...(taxAmount
						? [
								{
									price_data: {
										currency: "usd",
										product_data: { name: "Sales Tax" },
										unit_amount: taxAmount,
									},
									quantity: 1,
								},
							]
						: []),
				],
				success_url: `${process.env.FRONTEND_URL}/confirmation?success=true`,
				cancel_url: `${process.env.FRONTEND_URL}/cart`,
				customer_email: email,
			});

			ctx.send({ id: session.id });
		} catch (err: any) {
			ctx.response.status = 500;
			ctx.send({ error: err.message });
		}
	},
};
