const reload = require('require-reload')(require)
const path = require('path')
const sequential = require('promise-sequential')
module.exports = app => async (type, loadHandler) => {
	var sander = require('sander')
	var basePath = path.join(process.cwd(), 'database', type)
	var files
	try {
		files = sander.readdirSync(basePath).filter(f => f !== 'metadata.json')
	} catch (err) {
		files = []
	}
	let metadataPath = path.join(process.cwd(), 'database', type, 'metadata.json');
	var metadata = {}
	try {
		metadata = JSON.parse((await sander.readFile(metadataPath)).toString('utf-8'))
	} catch (err) {

	}
	await sequential(files.map(fileName => {
		return async () => {
			let k = Object.keys(metadata).find(k=>fileName.indexOf(k)!==-1)
			let meta = metadata[k] || {}
			if (!meta.name) {
				console.log('WARN', `[When reading files with type ${type}]`, 'No metadata present for', fileName, Object.keys(metadata))
				return;
			} else {
				await loadHandler({
					_id: fileName,
					name: meta.name,
					type: type
				})
			}

		}
	}))
}