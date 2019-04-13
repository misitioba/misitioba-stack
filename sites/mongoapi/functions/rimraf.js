module.exports = app => function(cmd) {
	return new Promise((resolve, reject) => {
		app.require('rimraf')(cmd, (err) => {
			if (err) reject(err)
			else resolve()
		})
	})
}