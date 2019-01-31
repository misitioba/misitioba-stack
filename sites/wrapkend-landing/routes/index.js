var sander = require('sander')
let files = sander.readdirSync(__dirname)
files = files.filter(f => f !== 'index.js').filter(f => {
	return f.indexOf('.js') !== -1
})
module.exports = app => {
	var self = {}
	files.forEach(f => {
		self[f.split('.')[0]] = require(__dirname + '/' + f)
	});
	var items = Object.keys(self).map((k, index) => {
		var mod = self[k]
		return {
			name: k,
			order: mod.order !== undefined ? mod.order : index,
			handler: mod.handler ? mod.handler : mod
		}
	}).sort((a, b) => {
		return a.order < b.order ? -1 : 1
	}).forEach(route => {

		
		if(typeof route.handler === 'function'){
			route.handler(app);
			//console.log('DEBUG','[CORE] [FILE LOAD] [ROUTE]', route.name)
		}else{
			console.log('WARN','[When loading route]', route.name, 'skiped (no handler)')
		}
		
	})
}