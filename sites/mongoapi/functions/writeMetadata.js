const sander = require('sander')
const path = require('path')
module.exports = app => async (folder, uniqueId, fileMetadata) => {
	let metadataPath = path.join(process.cwd(), 'database', folder,'metadata.json');
	var metadata = {}
	try{
		metadata = JSON.parse((await sander.readFile(metadataPath)).toString('utf-8'))
	}catch(err){

	}
	metadata[uniqueId]=metadata[uniqueId]||{}
	Object.assign(metadata[uniqueId],fileMetadata)
	await sander.writeFile(metadataPath, JSON.stringify(metadata,null,2))
}