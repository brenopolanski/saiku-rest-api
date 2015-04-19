'use strict'

var request = require('request');
var settings = require('./shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./LocalStorage');

function SchemasRequest(options) {
	this._options = options || {};

	this._url = this._options.host + settings.REST_URL + this._options.username + '/discover';
	
	return this;
}

SchemasRequest.prototype.get = function(callback) {
	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
	var cookieJar = request.jar();

	cookieJar.setCookie(jsessionid, this._url);

	request({
		method: 'GET',
		uri: this._url,
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

module.exports = SchemasRequest;