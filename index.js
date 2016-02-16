'use strict';
var fork = require('child_process').fork;
var basename = require('path').basename;
var clc = require('cli-color');
var glob = require('glob');

var implementations = glob.sync('./implementations/*.js');

(function nextImplementation() {
	if (!implementations.length) {
		process.exit();
	}
	
	var implName = implementations.shift();
	console.log('\n' + clc.magenta.bold(basename(implName)));
	
	var child = fork(implName);
	child.once('exit', nextImplementation);
}());
