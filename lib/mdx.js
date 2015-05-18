'use strict';
/**
 * @module Saiku
 * @submodule MDXRequest
 * @beta
 */
var request = require('request');
var settings = require('./shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./LocalStorage');
var url;

/**
 * MDXRequest handle the /api/query/execute API endpoint
 *
 * @class MDXRequest
 * @constructor
 * @param {Object} options A hash of options for the SessionRequest instance
 * @param {String} [options.host] A host name for send API requests
 * @param {String} [options.username] A username for authenticating API requests
 * @param {String} [options.password] A password for authenticating API requests
 */
function MDXRequest(options) {
	/**
	 * Get session id
	 * 
	 * @type String
	 * @private
	 */
	var sessionId = JSON.parse(localStorage.getItem('sessionInfo')).sessionid;
	
	/**
	 * Configuration options for the request
	 * 
	 * @property _options
	 * @type Object
	 * @private
	 * @default { host: 'http://localhost:8080', username: 'admin', password: 'admin' }
	 */
	this._options = options || {};
	this._options.queryName = options.queryName || sessionId;

	/**
	 * The URL template that will be used to assemble endpoint paths
	 * 
	 * @type String
	 * @private
	 */
	url = this._options.host + settings.REST_URL + 'api/query/execute';
}

/**
 * Execute query MDX
 *
 * @method execute
 * @public
 * @param  {Function} callback
 */
MDXRequest.prototype.execute = function(callback) {
	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
	var cookieJar = request.jar();

	cookieJar.setCookie(jsessionid, url);

	request({
		method: 'POST',
		uri: url,
		jar: cookieJar,
		headers: {
			'Accept': 'application/json',
			'content-type': 'application/json'
		},
		body: JSON.stringify({ 
			cube: {
				connection: this._options.connectionName,
				catalog: this._options.schemaName,
				schema: this._options.schemaName,
				name: this._options.cubeName,
			}, 
			name: this._options.queryName,
			mdx: this._options.mdx,
			queryType: 'OLAP',
			type: 'MDX'
		})
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

module.exports = MDXRequest;