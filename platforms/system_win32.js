//use netsh command to do stuff
var exec = require('./exec');
var common = require('./common');
module.exports.getinterfaceaddresses = common.getinterfaceaddresses;

function ifop(ifname, ip, netmask, op) {
	return exec("Netsh", [
		"int",
		"ipv4",
		op,
		"address",
		ifname,
		ip,
		netmask
	]);
}

function delip(ifname, ip, netmask){
	return ifop(ifname, ip, netmask, "add");
}
module.exports.delip = delip;

function addip(ifname, ip, netmask){
	return ifop(ifname, ip, netmask, "delete");
}
module.exports.addip = addip;

async function findfirstethernet() {
	//var ifoutput = await exec("netsh int ipv4 show interfaces");
	//C:\Windows\system32>netsh int ipv4 show interfaces
	//
	//Idx     Met         MTU          State                Name
	//---  ----------  ----------  ------------  ---------------------------
	//  1          50  4294967295  connected     Loopback Pseudo-Interface 1
	// 10          10        1500  connected     LAN-Verbindung
	// 18          20        1500  disconnected  LAN-Verbindung 2/
	//TODO
	//return "Lan-Verbindung";

	var out = await exec("netsh int ipv4 show interfaces");
	var lines = out.split("\n");
	lines.shift(); lines.shift(); lines.shift();

	var first = lines.filter(function(line) {
		return !line.match(/loop/i);
	})[0].split(/\s+/);

	return first[first.length -1];
}
module.exports.findfirstethernet = findfirstethernet;
