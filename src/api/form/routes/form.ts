export default {
	routes: [
		{
			method: 'POST',
			path: '/form',
			handler: 'form.feedback',
			config: {
				policies: [],
				middlewares: [],
			},
		},
	],
};
