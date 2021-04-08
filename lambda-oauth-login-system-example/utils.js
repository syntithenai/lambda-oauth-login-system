function getGatewayUrl() {
	if (process.env.IS_OFFLINE !== 'true') {
		return process.env.LAMBDA_REST_GATEWAY 
	// offline mode
	} else {
		return process.env.LAMBDA_REST_GATEWAY_OFFLINE
	}
}

function getLoginGatewayUrl() {
	if (process.env.IS_OFFLINE !== 'true') {
		return process.env.LOGIN_LAMBDA_REST_GATEWAY 
	// offline mode
	} else {
		return process.env.LOGIN_LAMBDA_REST_GATEWAY_OFFLINE
	}
}
function generateObjectId() {
	var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
	return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
		return (Math.random() * 16 | 0).toString(16);
	}).toLowerCase();
}
function decodeFromBase64(base64DataString) {
	const parts = base64DataString.split(';base64,')
	if (parts.length > 1) {
		const buffer = Buffer.from(parts[1], 'base64');
		return buffer
	}
};

module.exports = {getGatewayUrl, getLoginGatewayUrl, generateObjectId, decodeFromBase64}
