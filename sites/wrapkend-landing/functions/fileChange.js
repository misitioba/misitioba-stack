const sander = require('sander')
const path = require('path')
module.exports = app => async params => {

	var forceFullReload = false;
	if(!params.isPartial && params.isPartial===false){
		//forceFullReload= true;
	}

	params.isPartial = params.isPartial !== undefined ? params.isPartial : false


	if (params.privateKey !== process.env.PRIVATE_KEY) {
		console.log('SAVE - IGNORE', params.file.name, params.privateKey)
		return;
	}

	//let writePath = path.join(process.cwd(), 'database', params.file.type, params.file._id.toString())
	let writePath = await app.fn.getFilePath(params.file._id, params.file.type, params.file.name)
	//console.log('DEBUG','[Write path]',params.isPartial,params.file.name, writePath)
	await sander.writeFile(writePath, params.file.code)
	await app.fn.$core.writeMetadata(params.file.type, params.file._id, {
		name: params.file.name
	})

	var loaders = {
			function: app.fn.$core.loadFunction,
			middleware: app.fn.$core.loadMiddleware,
			pug: app.fn.$core.loadPug,
			service: app.fn.$core.loadService
		}
	var hasLoader = !!loaders[params.file.type];

	var isHot = !['schema','route','middleware'].includes(params.file.type);

	console.log('DEBUG','[FILE CHANGE]',params.file.type,params.file.name,'     ',`${params.isPartial?'[PARTIAL]':''}`,`${isHot?'[HOT]':'[REQUIRE RESTART]'}`,`${hasLoader?'[HAS LOADER]':''}`)


	if (!isHot) {
		await afterSave();
		if (params.isPartial === false) {
			fullReload('File is '+params.file.type)
		}

	} else {
		if (hasLoader) {
			await loaders[params.file.type](params.file)
		}
		await afterSave();
	}

	if(forceFullReload){
		fullReload('End of sync')
	}

	function fullReload(msg){
		console.log('DEBUG', '[FULL RELOAD IN PROGRESS]', msg)
		process.exit(0);
	}

	async function afterSave() {

		if (params.isPartial === false && app.srv.$core.config.isProd) {
			await requestGitSave()
		}

		if(params.doneId){
			app.workerSocket.emit('fileChangeSuccess',params.doneId)
		}

	}

	async function requestGitSave() {
		try {
			var rp = require('request-promise');

			await rp(app.srv.$core.config.managerUrl + 'gitSaveRequest?name=' + params.name)
		} catch (err) {
			console.warn('WARN', '[When requesting git save]', err.stack)

		}
	}

}