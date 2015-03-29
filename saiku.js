'use strict';

var extend = require('node.extend');
var SessionRequest = require('./lib/session');

var defaults = {
	host: 'localhost:8080',
	pathName: '/pentaho/plugin/saiku/api/',
	userName: 'Admin'
};

function Saiku(options) {
	if (this instanceof Saiku === false) {
		return new Saiku(options);
	}

	this._options = extend({}, defaults, options);

	return this;
}

Saiku.prototype.session = function(options) {
	options = options || {};
	options = extend(options, this._options);
	return new SessionRequest(options);
};

module.exports = Saiku;