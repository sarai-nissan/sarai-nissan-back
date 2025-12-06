module.exports = {
	routes: [
		{
			method: "POST",
			path: "/send-tracking",
			handler: "send-tracking.send",
			config: {
				auth: false,
			},
		},
	],
};
