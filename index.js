require('dotenv').config({
	silent:true
});
console.log('ROOT_PWD?', !!process.env.ROOT_PWD)
const {
	spawn, execSync, exec
} = require('child_process');
const argv = require('yargs').argv
const path = require('path');
const CADDYPATH = path.join(process.cwd());
const CLOUDFLARE_API_KEY = 'e2f734f1df33019efc8e2592bb866d715eebb'
var ca = argv.staging ? '-ca https://acme-staging-v02.api.letsencrypt.org/directory -http-port 5555 -https-port 5556' : '';
const cmd = `CLOUDFLARE_EMAIL=arancibiajav@gmail.com CLOUDFLARE_API_KEY=${CLOUDFLARE_API_KEY} CADDYPATH=${CADDYPATH} caddy -cpu=75% -agree=true -log=access.log -email=arancibiajav@gmail.com ${ca}`
console.log(`CMD
${cmd}
`)

//process.exit(0)

if (!!ca) {
	var child = exec(cmd, {
		cwd: process.cwd(),
		env: process.env,
		encoding: 'utf-8'
	});
	
	var fs = require('fs');
 
	var contents = fs.readFileSync(path.join(process.cwd(),'Caddyfile'), 'utf8');
	//contents.split(/\r?\n/)
	var target = contents.split('https://').length - 1;
	
	var httpsCounter = 0;
	var killed = false;
	
	child.stderr.on('data', function(data) {
			console.error('ERROR',data.toString())
			if(!killed){
				killed=true;
				child.kill(2);
				console.log('FAIL');
				process.exit(1);
			}
	});
	
	child.stdout.on('data', function(data) {
		var str = data.toString();
		var hasHttps = str.indexOf('https://') !== -1 ;
		if(hasHttps){
			httpsCounter++;
		}
    if(target == httpsCounter && !killed){
    	killed=true;
    	console.log('SUCCESS')
    	child.kill(2);
    	process.exit(0);
    }
	});
	
	setTimeout(function(){
		console.log('TIMEOUT');
		process.exit(1);
	}, 1000 * 60);
	
} else {
	execSync(cmd, {
		cwd: process.cwd(),
		env: process.env,
		encoding: 'utf-8',
		stdio: [0, 1, 2]
	});
}
/*
const child = spawn(cmd);
child.stdout.on('data', (data) => {
  console.log(data.toString());
});
child.stderr.on('data', (data) => {
  console.error(`${data}`);
});
*/