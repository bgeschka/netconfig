//use ip command to set stuff
var exec = require('./exec');

function iproute2(args){
	return exec("ip", args);
}

function changeip(ifname, ip, netmask, op){
	return iproute2([
		"a",
		op,
		ip + "/" + netmask,
		"dev",
		ifname
	]);
}

function delip(ifname, ip, netmask) {
	return changeip(ifname, ip, netmask, "del");
}
module.exports.delip = delip;

function addip(ifname, ip, netmask) {
	return changeip(ifname, ip, netmask, "add");
}
module.exports.addip = addip;

function parseInterface(line){
	var iline = line.trim();
	var ret = {};
	var name = iline.split(" ")[0];
	ret.name = name.replace(":","");

	var inet = iline.split("\n")
		.filter( l => l.match(/\s+inet /))
		.map(res => res.trim().split(" ")[1]);
	ret.inet = inet;

	var inet6 = iline.split("\n")
		.filter( l => l.match(/\s+inet6 /))
		.map(res => res.trim().split(" ")[1]);
	ret.inet6 = inet6;

	var mac = iline.split("\n")
		.filter( l => l.match(/\s+link\/ether /))
		.map(res => res.trim().split(" ")[1]);
	ret.mac = mac;

	return ret;
}

function parseIpA(output){
	var interfaces = output.split(/^\d+:/gm).filter(l => l.length != 0);
	return interfaces.map(parseInterface);
}

async function getinterfaceaddresses(dev){
	var ipa = await iproute2(["a"]);
	var interfaces = parseIpA(ipa);
	var match = interfaces.filter(i => i.name == dev);
	if(match[0]) return match[0].inet;
	return undefined;
}
module.exports.getinterfaceaddresses = getinterfaceaddresses;


async function findfirstethernet() {
	var ipa = await iproute2(["a"]);
	var interfaces = parseIpA(ipa);
	var match = interfaces.filter(iface => {
		return iface.name.match(/eth|enp/)
	});
	if(match[0]) return match[0].name;
}
module.exports.findfirstethernet = findfirstethernet;

