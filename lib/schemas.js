'use strict'

var request = require('request');
var settings = require('../shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;

var url = '';
var localStorage = new LocalStorage('./session');

function SchemasRequest(options) {
	if (this instanceof SchemasRequest === false) {
		return new SchemasRequest(options);
	}

	this._options = options || {};

	url = this._options.host + settings.REST_URL + this._options.userName + '/discover';

	return this;
}

SchemasRequest.prototype.get = function() {
	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
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
				// console.log(cookieJar);
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

module.exports = SchemasRequest;