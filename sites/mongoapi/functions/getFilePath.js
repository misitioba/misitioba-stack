const path = require('path')
const sander = require('sander')

module.exports = app => async (id, type, name = '') => {

	id = id.split('_')[id.split('_').length-1]

	if (!name) {
		let metadataPath = path.join(process.cwd(), 'database', type, 'metadata.json');
		var metadata = {}
		try {
			metadata = JSON.parse((await sander.readFile(metadataPath)).toString('utf-8'))
		} catch (err) {

		}
		let key = Object.keys(metadata).find(k=>id.indexOf(k)!==-1)
		let meta = metadata[key] || {}
		//id = id.split(meta.name+'_').join('')
		return path.join(process.cwd(), 'database', type, `${meta.name}_${id.toString()}`)
	} else {
		//id = id.split(name+'_').join('')
		return path.join(process.cwd(), 'database', type, `${name}_${id.toString()}`)
	}
}