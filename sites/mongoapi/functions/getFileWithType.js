const sander = require('sander')
const path = require('path')
module.exports = app => async (fileName,type) => {

	let metadata = JSON.parse((await sander.readFile(path.join(process.cwd(), `database/${type}/metadata.json`))).toString('utf-8'))
	console.log(`DEBUG','[after reading ${type} metadata]`,metadata,fileName)
	let id = Object.keys(metadata).find(k => metadata[k].name === fileName)
	if (id) {
		//let url = path.join(process.cwd(), `database/${type}`, id)
		let url = await app.fn.getFilePath(id, type)
		console.log('DEBUG',`[While reading ${type} file]`,url)
		return (await sander.readFile(url)).toString('utf-8')
	} else {
		return ""
	}

}