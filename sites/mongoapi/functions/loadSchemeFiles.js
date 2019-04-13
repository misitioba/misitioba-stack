const path = require('path')
module.exports = app => () => {
	return new Promise((resolve, reject) => {
		let basePath = path.join(process.cwd(), 'database/schema')
		var sander = require('sander')
		var files
		try {
			files = sander.readdirSync(basePath).filter(f => f !== 'metadata.json')
		} catch (err) {
			files = []
		}
		if (files.length === 0) {
			return resolve()
		} else {
			var self = {}
			files.forEach(f => {
				self[f.split('.')[0]] = require(path.join(basePath, f))
			});
			Object.keys(self).map((k, index) => {
				var mod = self[k]
				return {
					name: k,
					handler: mod.handler ? mod.handler : mod
				}
			}).forEach(fn => {
				try {
					let impl = fn.handler(app)
					app.functions[fn.name] = app.function[fn.name] = app.fn[fn.name] = impl
					console.log('DEBUG', '[FILE LOAD][Scheme]', fn.name)
				} catch (err) {
					console.error('ERROR','[While loading schema file]',fn.name,err.stack)
				}

			})
			resolve()
		}
	})
}