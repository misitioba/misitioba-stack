module.exports = app => {
	app.get('/alive', (req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	}, async (req, res) => {
		res.status(200).send()
	})


	app.get('/css/:name', async (req, res, next) => {
		try {
			let code = await app.fn.$core.getCssFile(req.params.name)
			if (code) {
				res.contentType("text/css");
				res.send(code)
			} else {
				next();
			}
		} catch (err) {
			console.warn('WARN', '[While retrieving css]', req.params.name, err.stack)
			next();
		}
	})

	app.get('/js/:name', async (req, res, next) => {
		try {
			let code = await app.fn.$core.getFileWithType(req.params.name, 'javascript')
			if (code) {
				res.contentType("text/javascript");
				res.send(code)
			} else {
				next();
			}
		} catch (err) {
			console.warn('WARN', '[While retrieving js]', req.params.name, err.stack)
			next();
		}
	})

	app.get('/remove-database-files', async (req, res) => {
		await app.fn.rimraf(require('path').join(process.cwd(), 'database/**'))
		res.status(200).send;
	})

}