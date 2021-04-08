const serverless = require('serverless-http');
const app = require('./app')

module.exports.handler =  async (event, context) => {
	const slsApp = serverless(app);
	return await slsApp(event,context)
}

