const reload = require('require-reload')(require)
const path = require('path')
module.exports = app => async file => {
	try {
		//var mod = reload(path.join(process.cwd(),'database',file.type,file._id.toString()))
		var mod = reload(await app.fn.getFilePath(file._id, file.type))
		let impl = mod(app)
		if (impl instanceof Promise) {
			app.fn[file.name] = await impl
		} else {
			app.fn[file.name] = impl
		}
		let fn = app.fn[file.name]
		app.fn[file.name] = async function() {
			try {
				let w = fn.apply(this, arguments)
				if (w instanceof Promise) {
					w = await w
				}
				return w;
			} catch (err) {
				console.error('ERROR','[When executing function]', err.stack)
				throw err
			}
		}
		console.log('DEBUG','[FILE LOAD] [Function]', file.name)
		return true;
	} catch (err) {
		console.error('ERROR', '[When loading function]', file.name, err.stack)
		return false;
	}
}