export default [
	"strapi::logger",
	"strapi::errors",
	{
		name: "strapi::cors",
		config: {
			origin: ["https://sarai-nisan-front.vercel.app", "http://localhost:5173"],
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
			headers: ["Content-Type", "Authorization", "Origin", "Accept"],
			credentials: true,
		},
	},
	"strapi::security",
	"strapi::poweredBy",
	"strapi::query",
	"strapi::body",
	"strapi::session",
	"strapi::favicon",
	"strapi::public",
];
