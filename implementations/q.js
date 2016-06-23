'use strict';
var Q = require('q');
Q.longStackSupport = false;
require('../lib/run')(Q.Promise);
