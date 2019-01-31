const reload = require('require-reload')(require)
const path = require('path')
module.exports = app => async file => {
	try {
		//var mod = reload(path.join(process.cwd(),'database',file.type,file._id.toString()))
		var mod = reload(await app.fn.getFilePath(file._id, file.type))
		let impl = mod(app)
		if (impl instanceof Promise) {
			impl = await impl
		}
		console.log('DEBUG','[FILE LOAD] [Route]', file.name)
		return true;
	} catch (err) {
		console.error('ERROR', '[When loading route]', file.name, err.stack)
		return false;
	}
}