'use strict';

var _ = require('underscore');
var SessionRequest = require('./lib/session');

var defaults = {
	host: 'http://localhost:8080',
	pathName: '/pentaho/plugin/saiku/api/',
	username: 'admin',
	password: 'admin'
};

function SaikuSession(options) {
	if (this instanceof SaikuSession === false) {
		return new SaikuSession(options);
	}

	this._options = _.extend({}, defaults, options);

	return this;
}

SaikuSession.prototype.session = function(options) {
	options = options || {};
	options = _.extend(options, this._options);
	return new SessionRequest(options);
};

module.exports = SaikuSession;