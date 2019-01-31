const path = require('path')
module.exports = app => (file, project) => {
	let url = app.srv.$core.config.managerUrl + 'worker'
	console.log('DEBUG [WORKER] Targeting wrapkend manager', url)
	var socket = require('socket.io-client')(url);
	socket.on('connect', function() {});
	socket.on('event', function(data) {});
	socket.on('disconnect', function() {});
	socket.on('fileChange', app.fn.$core.fileChange)
	socket.on('restart', privateKey => {
		if(privateKey==process.env.PRIVATE_KEY){
			app.fn.$core.restart();
		}else{
			console.log('TRACE [When socket.on.restart]', privateKey,process.env.PRIVATE_KEY)
		}
	})
	app.workerSocket = socket;

	var intercept = require("intercept-stdout")
	var includes = (txt, strArr) => {
		return strArr.find(str=>txt.indexOf(str) !== -1)
	}
	var unhook_intercept = intercept(function(txt) {
		if (includes(txt, ['TRACE', 'WARN', 'ERROR'])) {
			let t1 = txt.indexOf('TRACE')
			let t2 = txt.indexOf('WARN')
			let t3 = txt.indexOf('ERROR')
			let t = t1 >= 0 ? t1 : -1
			//if(t !== t1){
				t = t2 >= 0 && t2 < t ? t2 : t
				t = t3 >= 0 && t3 < t ? t3 : t
			//}
			let type = ''
			if (t === t1) type = 'TRACE'
			if (t === t2) type = 'ERROR'
			if (t === t3) type = 'WARN'
			if (type) {
				let s = txt.split(type)
				var message = txt
				if (s.length > 1) {
					message= type+' '+s[0]
				}
				//let message = s.map(line => type + line + '&#13;&#10;').join()
				app.workerSocket.emit('stdout', {
					key: process.env.PRIVATE_KEY,
					type,
					message: txt
				})
			}
		}
		return txt;
	});

}