'use strict';
var Promise;

exports.name = 'Rate of raw promise lifecycles';
exports.test = function (P, callback) {
	Promise = P;
	var testPoints = [];
	function testDone(err, rate) {
		if (testPoints.push(rate) === 100) {
			var average = testPoints.slice(10).reduce(sum, 0) / testPoints.length;
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
			process.nextTick(resolve);
		}).then(function () {
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
