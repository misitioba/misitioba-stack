const sander = require('sander')
const path = require('path')
module.exports = app => async fileName => {
	return app.fn.getFileWithType(fileName, 'css')

	let metadata = JSON.parse((await sander.readFile(path.join(process.cwd(), 'database/css/metadata.json'))).toString('utf-8'))
	console.log('DEBUG','[after reading css metadata]',metadata,fileName)
	let id = Object.keys(metadata).find(k => metadata[k].name === fileName)
	if (id) {
		let url = path.join(process.cwd(), 'database/css', id)
		console.log('DEBUG','[While reading css file]',url)
		return (await sander.readFile(url)).toString('utf-8')
	} else {
		return ""
	}

}