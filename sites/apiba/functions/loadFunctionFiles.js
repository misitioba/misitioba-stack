const reload = require('require-reload')(require)
const path = require('path')
const sequential = require('promise-sequential')
module.exports = app => async () => {
	var sander = require('sander')
	var basePath = path.join(process.cwd(), 'database', 'function')
	var files
	try {
		files = sander.readdirSync(basePath).filter(f => f !== 'metadata.json')
	} catch (err) {
		files = []
	}
	let metadataPath = path.join(process.cwd(), 'database', 'function', 'metadata.json');
	var metadata = {}
	try {
		metadata = JSON.parse((await sander.readFile(metadataPath)).toString('utf-8'))
	} catch (err) {

	}
	await sequential(files.map(fileName => {
		return async () => {
			let meta = metadata[fileName] || {}
			if (!meta.name) {
				console.log('WARN', '[When reading functions]', 'No metadata present for', fileName)
				return;
			} else {
				await app.fn.loadFunction({
					_id: fileName,
					name: meta.name,
					type: 'function'
				})
			}

		}
	}))
}