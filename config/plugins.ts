export default ({ env }) => ({
	email: {
		config: {
			provider: "nodemailer",
			providerOptions: {
				host: "smtp.resend.com",
				port: 465,
				secure: true,
				// requireTLS: true,
				// ignoreTLS: false,
				auth: {
					user: env("RESEND_SMTP_USER"),
					pass: env("RESEND_API_KEY"),
				},
			},
			settings: {
				defaultFrom: env("RESEND_FROM_EMAIL"),
				defaultReplyTo: env("RESEND_FROM_EMAIL"),
			},
		},
	},
	"webp-converter": {
		enabled: true,
		config: {
			mimeTypes: ["image/png", "image/jpeg", "image/jpg"],
		},
	},
	seo: {
		enabled: true,
	},
	upload: {
		config: {
			breakpoints: {
				xlarge: 1920,
				large: 1440,
				medium: 1024,
				small: 768,
				xsmall: 480,
				thumbnail: 240,
			},
		},
	},
});
