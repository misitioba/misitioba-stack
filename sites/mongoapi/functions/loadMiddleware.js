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

		app.use(function(req,res,next){
			console.log('DEBUG','[middleware start]',file.name)
			impl(req,res,function(){
				console.log('DEBUG','[middleware end]',file.name)
				next();
			})
		})

		console.log('DEBUG','[FILE LOAD] [Middleware]', file.name)
		return true;
	} catch (err) {
		console.error('ERROR', '[When loading middleware]', file.name, err.stack)
		return false;
	}
}