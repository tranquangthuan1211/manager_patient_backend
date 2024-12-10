import swaggerJSDoc from 'swagger-jsdoc';

const SwaggerOption: swaggerJSDoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Swagger API - OpenAPI 3.0',
			version: '1.0.0',
			description: 'API for mananger patient',
			contact: {
				name: 'Quang Thuan',
				email: 'tranquanthuan132@gmail.com'
			},
			license: {
				name: 'MIT',
				url: 'https://spdx.org/licenses/MIT.html'
			}
		},
		servers: [
			{
				url: 'http://localhost:3001/api/v1/'
			}
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					name: 'Authorization',
					type: 'http',
					scheme: 'bearer',
					in: 'header',
					bearerFormat: 'JWT'
				}
			}
		},
		security: [
			{
				bearerAuth: ['admin', 'user']
			}
		]
	},
	apis: ['./open_api/*.yaml']
};

export default SwaggerOption;
