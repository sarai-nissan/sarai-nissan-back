import Stripe from "stripe";
import { Context } from "koa";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: "2025-08-27.basil",
});

export default {
	async create(ctx: Context) {
		try {
			const { basketItems, form, shippingCost, taxAmount } = ctx.request.body;

			if (!form) return ctx.badRequest("Missing form data");

			const stripeItems = basketItems.map((item: any) => ({
				price_data: {
					currency: "usd",
					product_data: {
						name: item.product?.name ?? "Item",
						images: item.product?.photo ? [item.product.photo] : [],
					},
					unit_amount: Number(item.selectedPrice.replace("$", "")) * 100,
				},
				quantity: item.quantity,
			}));

			const session = await stripe.checkout.sessions.create({
				mode: "payment",

				line_items: [
					...stripeItems,
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

				metadata: {
					email: form.email,
					phone: form.phone,
					firstName: form.firstName,
					lastName: form.lastName,
					delivery: form.delivery,
					address1: form.address1,
					address2: form.address2,
					city: form.city,
					state: form.state,
					postalCode: form.postalCode,
					country: form.country,
					basket: JSON.stringify(basketItems),
				},

				success_url: `${process.env.FRONTEND_URL}/confirmation?success=true`,
				cancel_url: `${process.env.FRONTEND_URL}/checkout`,
				customer_email: form.email,
			});

			ctx.send({ id: session.id });
		} catch (err: any) {
			console.error("Checkout error:", err);
			ctx.response.status = 500;
			ctx.send({ error: err.message });
		}
	},
};
