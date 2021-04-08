const jwt = require('jsonwebtoken');

function userFromAuthHeaders(req,res,next) {
	let token = req.headers.authorization ? req.headers.authorization : ((req.query && req.query.id_token) ? req.query.id_token : null)
	if (token && token.indexOf('Bearer ') === 0) {
		token = token.slice(7)
	}
	if (token) { 
		var emailDirect = '';
		try {
			const decoded = jwt.verify(token,process.env.jwtAccessTokenSecret)
			//console.log(['decoded',JSON.stringify(decoded)]) //,err.message
			res.locals.user=decoded ? decoded.user : null
			
			//	res.send('OKYDOKE '+(res.locals.user ? res.locals.user.avatar : ''))
			//});
			//console.log(JSON.stringify(unverifiedDecodedAuthorizationCodeIdToken))
			//emailDirect = unverifiedDecodedAuthorizationCodeIdToken && unverifiedDecodedAuthorizationCodeIdToken.payload ? unverifiedDecodedAuthorizationCodeIdToken.payload.email : '';
			//res.locals.user={email:emailDirect}
			//console.log(['set user from token',emailDirect])
		} catch (e) {
			console.log('ERRRR')
			console.log(['err',e.toString()])
		}
	}
	next() //req,res,next)
}

module.exports = userFromAuthHeaders
