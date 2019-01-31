module.exports = app => {
	return function(req, res, next) {
		console.log('DEBUG', '[Request]', req.url)
		next();
	}
}