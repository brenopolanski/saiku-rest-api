'use strict';

var request = require('request');
var settings = require('./shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;
var Logdown = require('logdown');

var localStorage = new LocalStorage('./LocalStorage');
var logger = new Logdown();
var url;

function SessionRequest(options) {
	this._options = options || {};
	
	url = this._options.host + settings.REST_URL + 'session';
	
	return this;
}

SessionRequest.prototype.createSession = function() {
	var self = this;

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