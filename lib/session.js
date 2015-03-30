'use strict';

var request = require('request');
var settings = require('../shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;

var url = '';
var localStorage = new LocalStorage('./session');

function SessionRequest(options) {
	if (this instanceof SessionRequest === false) {
		return new SessionRequest(options);
	}

	this._options = options || {};

	url = this._options.host + settings.REST_URL + 'session';

	return this;
}

// SessionRequest.prototype.get = function(error, response) {
// 	var jsessionid = request.cookie(response.headers['set-cookie'][0]);
// 	var cookieJar = request.jar();

// 	cookieJar.setCookie(jsessionid, url);

// 	request({
// 		method: 'GET',
// 		uri: url,
// 		jar: cookieJar
// 	}, 
// 	function(error, response, body) {
// 		if (!error) {
// 			if (response.statusCode === 200) {
// 				console.log(cookieJar);
// 				console.log(response.body);
// 			}
// 			else {
// 				// 
// 			}
// 		}
// 		else {
// 			return console.log(error);
// 		}
// 	});
// };

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
		if (!error) {
			if (response.statusCode === 200) {
				console.log(cookieJar);
				console.log(response.body);
				localStorage.setItem('jsessionid', jsessionid);
				localStorage.setItem('sessionInfo', response.body);
			}
			else {
				// 
			}
		}
		else {
			return console.log(error);
		}
	});
}

// SessionRequest.prototype.get = function() {
// 	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
// 	var cookieJar = request.jar();

// 	cookieJar.setCookie(jsessionid, url);

// 	request({
// 		method: 'GET',
// 		uri: url,
// 		jar: cookieJar
// 	}, 
// 	function(error, response, body) {
// 		if (!error) {
// 			if (response.statusCode === 200) {
// 				console.log(cookieJar);
// 				console.log(response.body);
// 			}
// 			else {
// 				// 
// 			}
// 		}
// 		else {
// 			return console.log(error);
// 		}
// 	});
// };

SessionRequest.prototype.createSession = function(callback) {
	request({
		method: 'POST',
		uri: url,
		form: {
			username: this._options.userName,
			password: this._options.password
		}
	},
	function(error, response, body) {
		if (!error) {
			if (response.statusCode === 200) {
				setSessionLocalStorage(error, response);
				// callback(response.headers['set-cookie'][0]);
			}
			else {
				// 
			}
		}
		else {
			return console.log(error);
		}
	});
};

// SessionRequest.prototype.createSession = function() {
// 	request({
// 		method: 'POST',
// 		uri: url,
// 		form: {
// 			username: this._options.userName,
// 			password: this._options.password
// 		}
// 	},
// 	function(error, response, body) {
// 		if (!error) {
// 			if (response.statusCode === 200) {
// 				// SessionRequest.prototype.get(error, response);
// 				// callback(response.headers['set-cookie'][0]);
// 				localStorage.setItem('jsessionid', response.headers['set-cookie'][0]);
// 				console.log(response.headers['set-cookie'][0]);
// 			}
// 			else {
// 				// 
// 			}
// 		}
// 		else {
// 			return console.log(error);
// 		}
// 	});
// };

module.exports = SessionRequest;