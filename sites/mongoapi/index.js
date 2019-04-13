require('dotenv').config({
	silent: true
});
const express = require('express')
const app = express()
const server = require('http').Server(app);
const PORT = process.env.PORT || 8085
const path = require('path')
app.require = require('require-install');
//console.log('DEBUG', '[Bootstraps]')
require('./bootstraps')(app).then(() => {
	try {
		require('./functions')(app)
		//console.log('DEBUG', '[services]')
		require('./services')(app).then(async () => {
			try {
				//console.log('DEBUG', '[loading config]')
				await app.srv.config.init()
				//console.log('DEBUG', '[configuring io client]')
				app.fn.configureIOClient(server)
				//console.log('DEBUG', '[middlewares]')
				require('./middlewares')(app)
				require('./routes')(app)

				try {
					console.log('DEBUG', '[Loading database]','Reading user custom files')
					await app.fn.loadLocalFiles('function',app.fn.loadFunction)
					await app.fn.loadLocalFiles('service',app.fn.loadService)
					await app.fn.loadSchemeFiles(app)
					await app.fn.loadLocalFiles('middleware', app.fn.loadMiddleware)
					await app.fn.loadLocalFiles('route', app.fn.loadRoute)
				} catch (err) {
					console.error('ERROR', err.stack)
					return setTimeout(() => process.exit(0), 20000)
				}


				app.use('/', express.static(path.join(process.cwd(), 'public')));
				server.listen(PORT, function() {
					console.log('DEBUG', '[After init]', `Listening on ${PORT}`)
				})
			} catch (err) {
				onError(err, '[After loading services]')
			}
		}).catch(err=>onError(err,'[While loading services]'))
	} catch (err) {
		onError(err, '[After loading bootstraps]')
	}
});

function onError(err, when) {
	console.error('ERROR', when, err.stack)
	return setTimeout(() => process.exit(0), 20000)
}