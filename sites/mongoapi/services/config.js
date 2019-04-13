module.exports = app => {
	let self = {}
	const isProd = self.isProd = process.env.NODE_ENV === 'production'
	self.managerUrl = isProd ? 'http://178.128.254.49:8084/' : 'http://localhost:8084/'

	async function init() {
		return new Promise((resolve, reject) => {
			if (!isProd) {
				try {

					var getDockerHost = app.require('get-docker-host')
					getDockerHost((err, result) => {
						if (result) {
							self.managerUrl = result + ':8084/'
							console.log('DEBUG', '[docker host ip]', result)
							resolve()
						} else {
							//console.warn('WARN', '[While getDockerHost]', err.stack)
							resolve()
						}
					})
				} catch (err) {
					//console.warn('WARN', '[While getDockerHost]', err.stack)
					resolve()
				}
			} else {
				resolve();
			}
		})
	}

	self.init = init

	return self;
}