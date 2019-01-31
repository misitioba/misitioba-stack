const reload = require('require-reload')(require)
const path = require('path')
module.exports = app => async file => {
	try {
		//var mod = reload(path.join(process.cwd(), 'database', file.type, file._id.toString()))
		var mod = reload(await app.fn.getFilePath(file._id, file.type))
		var name = file.name

		if(mod instanceof Array){
			name = mod[0]
			mod = mod[1]
		}

		if (typeof mod !== 'function') {
			throw new Error('Function expected (module.exports = app => {})')
		}

		let impl = mod(app)
		if (impl instanceof Promise) {
			app.srv[name] = await impl
		} else {
			app.srv[name] = impl
		}
		console.log('DEBUG', '[FILE LOAD] [Service]', file.name)
		return true;
	} catch (err) {
		console.error('ERROR', '[When loading service]', file.name, err.stack)
		return false;
	}
}