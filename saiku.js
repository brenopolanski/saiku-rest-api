'use strict';

var extend = require('node.extend');
var SessionRequest = require('./lib/session');

var defaults = {
	host: 'http://localhost:8080',
	pathName: '/pentaho/plugin/saiku/api/',
	userName: 'admin',
	password: 'admin'
};

function Saiku(options) {
	if (this instanceof Saiku === false) {
		return new Saiku(options);
	}

	this._options = extend({}, defaults, options);

	var session = new SessionRequest(this._options);
	session.createSession(function(response) {
		console.log(response);
	});

	return this;
}

// Saiku.prototype.session = function(options) {
// 	options = options || {};
// 	options = extend(options, this._options);
// 	return new SessionRequest(options);
// };

module.exports = Saiku;