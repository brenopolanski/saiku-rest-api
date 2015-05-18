'use strict';
/**
 * A Saiku REST API client for Node.js
 *
 * @example
 * 		var saikuSession = new SaikuSession({ host: 'http://localhost:8081' });
 * 		saikuSession.session().createSession();
 *
 * @module SaikuSession
 * @main SaikuSession
 * @beta
 */

// Pull in request module constructors
var _ = require('underscore');
var SessionRequest = require('./lib/session');

var defaults = {
	host: 'http://localhost:8080',
	pathName: '/pentaho/plugin/saiku/api/',
	username: 'admin',
	password: 'admin'
};

/**
 * The base constructor for the SaikuSession API service
 *
 * @class SaikuSession
 * @constructor
 * @uses SessionRequest
 * @param {Object} options An options hash to configure the instance
 * @param {String} [options.host] A host name for send API requests
 * @param {String} [options.username] A username for authenticating API requests
 * @param {String} [options.password] A password for authenticating API requests
 */
function SaikuSession(options) {
	if (this instanceof SaikuSession === false) {
		return new SaikuSession(options);
	}

	this._options = _.extend({}, defaults, options);

	return this;
}

/**
 * Start a request against the `/session` endpoint
 *
 * @method session
 * @param {Object} [options] An options hash for a new SessionRequest
 * @return {SessionRequest} A SessionRequest instance
 */
SaikuSession.prototype.session = function(options) {
	options = options || {};
	options = _.extend(options, this._options);
	return new SessionRequest(options);
};

module.exports = SaikuSession;