export default ({ env }) => ({
	host: env('HOST', '0.0.0.0'),
	port: env.int('PORT', 1337),
	url: env('PUBLIC_URL', 'https://lignineco.com'),
	app: {
		keys: env.array('APP_KEYS'),
	},
	allowedHosts: ['localhost', '127.0.0.1', 'lignineco.com'],
});
