'use strict';

var request = require('request');
var settings = require('./shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./LocalStorage');
var url;

function ExportRequest(options) {
	this._options = options || {};

	url = this._options.host + settings.REST_URL + this._options.username + '/export/saiku/' + 
		this._options.mimetype + '?formatter=flattened&file=' + this._options.filepath;
	
	return this;
}

// JSON/HTML/CSV/XLS/
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

module.exports = ExportRequest;