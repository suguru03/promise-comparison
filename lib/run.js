'use strict';
var pathJoin = require('path').join;
var clc = require('cli-color');
var glob = require('glob');

process.on('disconnect', function () {
	process.exit(1);
});

module.exports = function (Promise) {
	var tests = glob.sync(pathJoin(__dirname, 'tests/*.js'));
	(function nextTest() {
		if (!tests.length) {
			process.exit();
		}
		
		var testFile = tests.shift();
		var test = require(testFile);
		console.log(test.name);
		test.test(Promise, function (err, result) {
			process.stdout.write(clc.move.up(1));
			if (err) {
				console.log(clc.red(test.name) + ':\t' + clc.red('FAIL'));
				console.error(err.stack);
				process.exit(1);
			}
			console.log(clc.green(test.name) + ':\t' + clc.cyan(String(result)));
			nextTest();
		});
	}());
}
