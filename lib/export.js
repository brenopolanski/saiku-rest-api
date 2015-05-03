'use strict';

var request = require('request');
var settings = require('./shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./LocalStorage');
var url;

function ExportRequest(options) {
	var sessionId = JSON.parse(localStorage.getItem('sessionInfo')).sessionid;
	this._options = options || {};
	this._options.queryName = options.queryName || sessionId;

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

	console.log(url);
	
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

// HTML/CSV/XLS/PDF
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