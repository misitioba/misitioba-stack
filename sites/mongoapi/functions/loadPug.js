const sander = require('sander')
const path = require('path')
module.exports = app => async file => {
	try {
		//let fullPath = path.join(process.cwd(), 'database', file.type, file._id.toString())
		let fullPath = await app.fn.getFilePath(file._id, file.type)
		let code = await sander.readFile(fullPath)
		app.$pugViews = app.$pugViews || {}
		app.$pugViews[file.name] = code;
		sander.writeFile(path.join(process.cwd(), 'tmp', 'pugs', file.name), code)
		console.log('DEBUG', '[FILE LOAD] [Pug]', file.name)
		return true;
	} catch (err) {
		console.error('ERROR', '[When loading pug file]', file.name, err.stack)
		return false;
	}
}