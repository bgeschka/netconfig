const netconfig = require('./index');

async function main(){
	var dev = await netconfig.findfirstethernet();
	console.log("using dev:", dev);

	var current_ips = await netconfig.getinterfaceaddresses(dev)
	var first_ips = current_ips;
	console.log("before:", current_ips);

	await netconfig.addip(dev, "192.168.241.3", "255.255.255.0");

	current_ips = await netconfig.getinterfaceaddresses(dev)
	console.log("between:", current_ips);

	await netconfig.delip(dev, "192.168.241.3", "255.255.255.0");

	current_ips = await netconfig.getinterfaceaddresses(dev)
	console.log("after:", current_ips);
	if(current_ips.length != first_ips.length) console.error("test failed");
}

main();
