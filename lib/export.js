'use strict';
/**
 * @module Saiku
 * @submodule ExportRequest
 * @beta
 */
var request = require('request');
var settings = require('./shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./LocalStorage');
var url;

/**
 * ExportRequest handle the /api/query/admin/export API endpoint
 *
 * @class ExportRequest
 * @constructor
 * @param {Object} options A hash of options for the SessionRequest instance
 * @param {String} [options.host] A host name for send API requests
 * @param {String} [options.username] A username for authenticating API requests
 * @param {String} [options.password] A password for authenticating API requests
 */
function ExportRequest(options) {
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
	if (this._options.filePath) {
		url = this._options.host + settings.REST_URL + this._options.username + '/export/saiku/' +
			this._options.mimetype + '?formatter=flattened&file=' + this._options.filePath;
	}
	else if (this._options.filePath === undefined && 
		this._options.mimetype === 'html') {
		
		url = this._options.host + settings.REST_URL + 'api/query/' + this._options.queryName + '/export/' + this._options.mimetype;
	}
	else {
		url = this._options.host + settings.REST_URL + 'api/query/' + this._options.queryName + '/export/' + this._options.mimetype + '/flattened';
	}
}

/**
 * Export file (JSON/HTML/CSV/XLS/)
 *
 * @method file
 * @public
 * @param  {Function} callback
 */
ExportRequest.prototype.file = function(callback) {
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

/**
 * Export query (HTML/CSV/XLS/PDF)
 *
 * @method query
 * @public
 * @param  {Function} callback
 */
ExportRequest.prototype.query = function(callback) {
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

module.exports = ExportRequest;