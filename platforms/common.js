var os = require('os');

function getinterfaceaddresses(ifname) {
	var ifaces = os.networkInterfaces();
	var iface = ifaces[ifname];
	if(!iface) return [];
	var ret = iface.filter(function(el) {
		return el.family == 'IPv4';
	}).map(function(el) {
		return {
			ip: el.address,
			netmask: el.netmask
		};
	});
	return ret;
}


module.exports.getinterfaceaddresses = getinterfaceaddresses;
