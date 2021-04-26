function getOptions(config,overrides) {
	
	
	var options = {
			findOneAndUpdate: false,
			allowRegexp: false,
			onError: (err, req, res, next) => {
			  const statusCode = req.erm.statusCode // 400 or 404

			  res.status(statusCode).json({
				message: err.message
			  })
			}, 
			//preRead: (req, res, next) => {
				//console.log('PREREAD',req.originalUrl,res.locals ? JSON.stringify(res.locals.user) : 'nolloc')
				////console.log(req && req.erm && req.erm.query)
				//if (res.locals && res.locals.user) {
					//if (res.locals.user.is_admin) {
						//// don't mess with open filter
					//} else {
						//// add filtering to allow view public and owned
						//var parts = []
						//if (req.erm && req.erm.query && req.erm.query.query) {
							//parts.push(req.erm.query.query)
						//}
						//parts.push({$or:[{access:'public'},{user:res.locals.user._id}]})
						//var newQuery = {$and:parts}
						//req.erm.query.query = newQuery
					//}
				//} else {
					//var parts = []
					//if (req.erm && req.erm.query && req.erm.query.query) {
						//parts.push(req.erm.query.query)
					//}
					//parts.push({access:'public'})
						
					//var newQuery = {$and:parts}
					//req.erm.query.query = newQuery
				//}
				//console.log(req && req.erm && JSON.stringify(req.erm.query))
				 //next()
			//},
			preCreate: (req, res, next) => {
				console.log(['PRECREATE',req.originalUrl,res.locals.user,req.body])
				// must be authenticated
				if (res.locals && res.locals.user && res.locals.user._id) {
					req.body.created_date = new Date().getTime();
					req.body.updated_date = new Date().getTime();
					req.body.user = res.locals.user._id
					if (options.preSave) options.preSave(req,res,next)
					else next()
				} else {
					console.log('Not authenticated')
					return res.sendStatus("401") // not authenticated
				}
			},
			
			preUpdate: (req, res, next) => {
				console.log(['PREUPDATE',req.originalUrl,res.locals.user,req.body])
				// must be authenticated and match user (or admin)
				if (res.locals.user && res.locals.user._id ) {
					if ((req.body.user && req.body.user === res.locals.user._id) || res.locals.user.is_admin)  {
						req.body.updated_date = new Date().getTime();
						req.body.user = res.locals.user._id
						if (options.preSave) options.preSave(req,res,next)
						else next()
					} else {
						console.log('Incorrect User')
						return res.sendStatus("401") // not authenticated
					}
				} else {
					console.log('Not authenticated')
					return res.sendStatus("401") // not authenticated
				}
			},
			
			preDelete: (req, res, next) => {
				console.log(['PREDELETE',req.originalUrl,res.locals.user])

			  if (res.locals.user && res.locals.user._id ) {
					if ((req.body.user && req.body.user === res.locals.user._id) || res.locals.user.is_admin)  {
						next()
					} else {
						console.log('Incorrect User')
						return res.sendStatus("401") // not authenticated
					}
				} else {
					console.log('Not authenticated')
					return res.sendStatus("401") // not authenticated
				}
			}, 

			postCreate: (req, res, next) => {
				//console.log('postCreate')
			   next()
			},
			
			postUpdate: (req, res, next) => {
				//console.log('postupdate')
			   next()
			},
			
			postDelete: (req, res, next) => {
				//console.log('PDEL MAS')
				//console.log(req)
			  	if (config && config.postDelete) config.postDelete(req,res,next)
				else next()
			}
			

	}
	if (overrides && typeof overrides === 'object') {
		Object.assign(options,overrides)
	}
	return options
}
module.exports = getOptions
