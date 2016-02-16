'use strict';
var fork = require('child_process').fork;
var basename = require('path').basename;
var clc = require('cli-color');
var glob = require('glob');

var implementations = glob.sync('./implementations/*.js');
var env = copyEnv(process.env);

(function nextImplementation() {
	if (!implementations.length) {
		process.exit();
	}
	
	var implName = implementations.shift();
	console.log('\n' + clc.magenta.bold(basename(implName)));
	
	var child = fork(implName, {env: env});
	child.once('exit', nextImplementation);
}());

function copyEnv(obj) {
	var result = {};
	for (var key in obj) {
		if (key.indexOf('BLUEBIRD_') === -1) {
			result[key] = obj[key];
		}
	}
	result.NODE_ENV = 'production';
	return result;
}
