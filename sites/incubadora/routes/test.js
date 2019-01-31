module.exports = app => {
	if (process.env.NODE_ENV === 'production') {
		return;
	}
	app.get('/test/:name', async (req, res) => {
		console.log('Runnig test', req.params.name)
		try {
			let rta = await app.srv.$core.testing[req.params.name]()
			res.status(200).json(rta)
		} catch (err) {
			console.warn('WARN', '[When runnig test]', req.params.name, err.stack)
			res.status(500).json(err.stack)
		}
	})
}