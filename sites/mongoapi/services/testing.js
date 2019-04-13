module.exports = app => {
	return {
		async fileChange() {
			await app.fn.$core.fileChange({
				"file": {
					"_id": "5b54bcd974a0f900278b0a26",
					"name": "enableProjectLogs",
					"code": "module.exports = (app) => {\n\treturn async ({\n\t\tproject\n\t}) => {\n\t\tawait app.waitForService('projectLogs')\n\t\tconsole.log('enableProjectLogs', project)\n\t\tapp.service.projectLogs.stream(project)\n\t\treturn {\n\t\t\tmessage:\"OK\"\n\t\t}\n\t}\n}//13",
					"type": "function"
				},
				"privateKey": "wrapkend-405gzt11zjkwo23r2",
				"name": "wrapkend-droplet"
			})
	}
}
}