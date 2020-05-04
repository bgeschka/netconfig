const {
	exec
} = require('child_process');


module.exports = function(cmd, args) {
	return new Promise( (resolve, reject) => {
		var _cmd = cmd + " " + args.join(" ");
		exec(_cmd, {}, function(error, stdout, stderr) {
			if(error) {
				console.error("stderr");
				reject(error);
				return;
			}

			resolve(stdout);
		});
	});
};
