module.exports = {
	routes: [
		{
			method: "POST",
			path: "/check-pin",
			handler: "check-pin.verifyPin",
			config: {
				auth: false,
			},
		},
	],
};
