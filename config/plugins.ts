export default ({ env }) => ({
	email: {
		config: {
			provider: 'nodemailer',
			providerOptions: {
				host: 'smtp.yandex.ru',
				port: 465,
				secure: true,
				// requireTLS: true,
				// ignoreTLS: false,
				auth: {
					user: env('SMTP_AUTH_USER'),
					pass: env('SMTP_AUTH_PASS'),
				},
			},
			settings: {
				defaultFrom: env('SMTP_AUTH_USER'),
				defaultReplyTo: env('SMTP_AUTH_USER'),
			},
		},
	},
	'webp-converter': {
		enabled: true,
		config: {
			mimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
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
