'use strict';

var extend = require('node.extend');
var SessionRequest = require('./lib/session');

// add in settings
var defaults = {
	host: 'http://localhost:8080',
	pathName: '/pentaho/plugin/saiku/api/',
	userName: 'admin',
	password: 'admin'
};

var SaikuSession = function() {};

SaikuSession.prototype.init = function(options) {
	this._options = extend({}, defaults, options);

	SessionRequest(this._options).createSession();

	return this;
};

module.exports = new SaikuSession();