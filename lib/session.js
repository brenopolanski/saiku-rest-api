'use strict';
/**
 * @module SaikuSession
 * @submodule SessionRequest
 * @beta
 */
var request = require('request');
var settings = require('./shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;
var Logdown = require('logdown');

var localStorage = new LocalStorage('./LocalStorage');
var logger = new Logdown();
var url;

/**
 * SessionRequest handle the /session API endpoint
 *
 * @class SessionRequest
 * @constructor
 * @param {Object} options A hash of options for the SessionRequest instance
 * @param {String} [options.host] A host name for send API requests
 * @param {String} [options.username] A username for authenticating API requests
 * @param {String} [options.password] A password for authenticating API requests
 */
function SessionRequest(options) {
	/**
	 * Configuration options for the request
	 * 
	 * @property _options
	 * @type Object
	 * @private
	 * @default {}
	 */
	this._options = options || {};
	
	/**
	 * The URL template that will be used to assemble endpoint paths
	 * 
	 * @type String
	 * @private
	 */
	url = this._options.host + settings.REST_URL + 'session';
}

/**
 * Create a session for the requests
 *
 * @method createSession
 * @public
 */
SessionRequest.prototype.createSession = function() {
	request({
		method: 'POST',
		uri: url,
		form: {
			username: this._options.username,
			password: this._options.password
		}
	},
	function(error, response, body) {
		if (!error && response.statusCode === 200) {
			setSessionLocalStorage(error, response);
		}
		else {
			logger.error('Failed to create session');
			return;
		}
	});
};

/**
 * Set a session in local storage
 *
 * @private
 * @param {Object} error Error return
 * @param {Object} response Response return
 */
function setSessionLocalStorage(error, response) {
	var jsessionid = response.headers['set-cookie'][0];
	var cookieSessionId = request.cookie(jsessionid);
	var cookieJar = request.jar();

	cookieJar.setCookie(cookieSessionId, url);

	request({
		method: 'GET',
		uri: url,
		jar: cookieJar
	}, 
	function(error, response, body) {
		if (!error && response.statusCode === 200) {
			logger.log('✔ Session successfully created');
			localStorage.setItem('jsessionid', jsessionid);
			localStorage.setItem('sessionInfo', response.body);
		}
		else {
			logger.error('Failed to create session');
			return;
		}
	});
}

module.exports = SessionRequest;