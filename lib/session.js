'use strict';

var extend = require('node.extend');
var request = require('request');
var settings = require('../shared/settings');

var url = '';

function SessionRequest(options) {
	this._options = options || {};

	url = this._options.host + settings.REST_URL + 'session';

	return this;
}

SessionRequest.prototype.get = function(error, response) {
	var jsessionid = request.cookie(response.headers['set-cookie'][0]);
	var cookieJar = request.jar();

	cookieJar.setCookie(jsessionid, url);

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
				// SessionRequest.prototype.get(error, response);
				callback(response.headers['set-cookie'][0]);
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

module.exports = SessionRequest;