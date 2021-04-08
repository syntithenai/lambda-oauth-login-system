// https://github.com/odysseyscience/react-s3-uploader

 var uuidv4 = require('uuidv4'),
     aws = require('aws-sdk'),
     express = require('express');

//aws.config.update({
    //accessKeyId: 'AKIAJKB74MRH47C57DJA',
    //secretAccessKey: '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'
//});

function checkTrailingSlash(path) {
    if (path && path[path.length-1] != '/') {
        path += '/';
    }
    return path;
}

function S3Router(options, middleware) {

    if (!middleware) {
        middleware = [];
    }

    var S3_BUCKET = options.bucket,
        getFileKeyDir = options.getFileKeyDir || function() { return ""; };

    if (!S3_BUCKET) {
        throw new Error("S3_BUCKET is required.");
    }

    var getS3 = options.getS3;
    if (!getS3) {
      var s3Options = {};
      if (options.region) {
        s3Options.region = options.region;
      }
      if (options.signatureVersion) {
        s3Options.signatureVersion = options.signatureVersion;
      }

      getS3 = function() {
        return new aws.S3(s3Options);
      };
    }

    if (options.uniquePrefix === undefined) {
        options.uniquePrefix = true;
    }

    var router = express.Router();

    /**
     * Redirects image requests with a temporary signed URL, giving access
     * to GET an upload.
     */
    function tempRedirect(req, res) {
        var params = {
            Bucket: S3_BUCKET,
            Key: checkTrailingSlash(getFileKeyDir(req)) + req.params[0]
        };
        var s3 = getS3();
        s3.getSignedUrl('getObject', params, function(err, url) {
            res.redirect(url);
        });
    };

    /**
     * Image specific route.
     */
    router.get(/\/img\/(.*)/, middleware, function(req, res) {
        return tempRedirect(req, res);
    });

    /**
     * Other file type(s) route.
     */
    router.get(/\/uploads\/(.*)/, middleware, function(req, res) {
        return tempRedirect(req, res);
    });


    /**
     * Returns an object with `signedUrl` and `publicUrl` properties that
     * give temporary access to PUT an object in an S3 bucket.
     */
    router.get('/sign', middleware, function(req, res) {
        var filename = (req.query.path || '') + (options.uniquePrefix ? uuidv4() + "_" : "") + req.query.objectName;
        var mimeType = req.query.contentType;
        var fileKey = checkTrailingSlash(getFileKeyDir(req)) + filename;
        // Set any custom headers
        if (options.headers) {
          res.set(options.headers);
        }

        var s3 = getS3();
        var params = {
            Bucket: S3_BUCKET,
            Key: fileKey,
            Expires: 60,
            ContentType: mimeType,
            ACL: options.ACL || 'private'
        };
        function getSignedUrl() { 
			s3.getSignedUrl('putObject', params, function(err, data) {
				if (err) {
					console.log(err);
					return res.status(500).send("Cannot create S3 signed URL - "+err.message);
				}
				res.json({
					signedUrl: data,
					publicUrl: '/s3/uploads/' + filename,
					filename: filename,
					fileKey: fileKey,
				});
			});
		}
		
		s3.headBucket({Bucket: S3_BUCKET}, function(err, data) {
			if (err) {
				s3.createBucket({
					Bucket: S3_BUCKET, 
					ACL: 'public-read'
				}, function(err, data) {
					if (err) {
						//console.log(err, err.stack); // an error occurred
					} else {
						s3.putBucketCors{
							Bucket: S3_BUCKET, 
							ACL: 'public-read'
						}, function(err, data) {
							if (err) {
								//console.log(err, err.stack); // an error occurred
							} else {
								s3.putBucketCors()
								//console.log(data);           // successful response
							}
						});
					}
				});
				//console.log(err, err.stack); // an error occurred
			} else {
				//console.log(data);           // successful response	
			}
		});
		
    });

    return router;
}

module.exports = S3Router;
