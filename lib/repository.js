'use strict';
/**
 * @module Saiku
 * @submodule RepositoryRequest
 * @beta
 */
var request = require('request');
var settings = require('./shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./LocalStorage');
var url;

/**
 * RepositoryRequest handle the /api/repository API endpoint
 *
 * @class RepositoryRequest
 * @constructor
 * @param {Object} options A hash of options for the SessionRequest instance
 * @param {String} [options.host] A host name for send API requests
 * @param {String} [options.username] A username for authenticating API requests
 * @param {String} [options.password] A password for authenticating API requests
 */
function RepositoryRequest(options) {
	/**
	 * Configuration options for the request
	 * 
	 * @property _options
	 * @type Object
	 * @private
	 * @default { host: 'http://localhost:8080', username: 'admin', password: 'admin' }
	 */
	this._options = options || {};

	/**
	 * The URL template that will be used to assemble endpoint paths
	 * 
	 * @type String
	 * @private
	 */
	url = this._options.host + settings.REST_URL + 'api/repository?type=' + this._options.type;
}

/**
 * Return matada repository
 *
 * @method get
 * @public
 * @param  {Function} callback
 */
RepositoryRequest.prototype.get = function(callback) {
	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
	var cookieJar = request.jar();

	cookieJar.setCookie(jsessionid, url);

	request({
		method: 'GET',
		uri: url,
		jar: cookieJar
	}, 
	function(error, response, body) {
		if (!error && response.statusCode === 200) {
			callback(error, response.body);
		}
		else {
			callback(error, response.body);
		}
	});
};

module.exports = RepositoryRequest;