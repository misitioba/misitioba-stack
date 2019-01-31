module.exports = app => {
	cookieParser = app.require('cookie-parser')
	app.use(cookieParser())
}