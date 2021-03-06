'use strict';
var Promise;
var numberOfTests = 20;
var data = new Buffer(1024).fill(0xff);

exports.name = 'Rate of raw promise lifecycles';
exports.test = function (P, callback) {
	Promise = P;
	var testPoints = [];
	function testDone(err, rate) {
		if (testPoints.push(rate) === numberOfTests) {
			var average = testPoints.slice(Math.floor(numberOfTests / 10)).reduce(sum, 0) / testPoints.length;
			
			// var filename = require('path').basename(require.main.filename).replace(/\..*$/, '') + '.csv';
			// require('fs').writeFileSync(filename, testPoints.join('\n'));
			
			callback(null, Math.round(average) + ' promises/s');
		} else {
			stressTest(testDone);
		}
	}
	setTimeout(function () {
		stressTest(testDone);
	}, 500);
};

function stressTest(cb) {
	var count = 10000;
	var pending = 0;
	
	var startTime = process.hrtime();
	while (pending < count) {
		++pending;
		emit();
	}
	
	function emit() {
		new Promise(function (resolve, reject) {
			process.nextTick(function () {
				resolve(data);
			});
		}).then(function (data) {
			if (--pending === 0) {
				var diff = process.hrtime(startTime);
				var seconds = diff[1] / 1e9 + diff[0];
				setImmediate(function () {
					cb(null, count / seconds);
				});
			}
		});
	}
}

function sum(a, b) {
	return a + b;
}
