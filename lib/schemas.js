'use strict'

var request = require('request');
var settings = require('./shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;
var Logdown = require('logdown');

var localStorage = new LocalStorage('./LocalStorage');
var logger = new Logdown();
var url;

function SchemasRequest(options) {
	this._options = options || {};

	url = this._options.host + settings.REST_URL + this._options.username + '/discover';
	
	return this;
}

// SchemasRequest.prototype.get = function(callback) {
// 	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
// 	var cookieJar = request.jar();

// 	cookieJar.setCookie(jsessionid, url);

// 	request({
// 		method: 'GET',
// 		uri: url,
// 		jar: cookieJar
// 	}, 
// 	function(error, response, body) {
// 		if (!error && response.statusCode === 200) {
// 			setSchemasLocalStorage(error, response.body);
// 			callback(error, response.body);
// 		}
// 		else {
// 			setSchemasLocalStorage(error, response.body);
// 			callback(error, response.body);
// 		}
// 	});
// };

SchemasRequest.prototype.get = function(callback) {
	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
	var cookieJar = request.jar();

	cookieJar.setCookie(jsessionid, url);

	getSchemas(cookieJar, callback);
};

// SchemasRequest.prototype.metadata = function(callback) {
// 	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
// 	var cookieJar = request.jar();
// 	var keys = fetchCubes();
// 	var len = keys.length;

// 	cookieJar.setCookie(jsessionid, url);

// 	for (var i = 0; i < len; i++) {
// 		getMetadata(cookieJar, keys[i], callback);
// 	}
// };

SchemasRequest.prototype.metadata = function(callback) {
	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
	var cookieJar = request.jar();
	var keys = fetchCubes();
	var len = keys.length;

	cookieJar.setCookie(jsessionid, url);

	for (var i = 0; i < len; i++) {
		// getMetadata(cookieJar, keys[i], callback);
		callback('', localStorage.getItem('cube.' + keys[i]));
	}
};

function setSchemasLocalStorage(error, data) {
	if (!error) {
		logger.log('✔ Schemas successfully created');
		localStorage.setItem('schemas', data);
		setMetadataLocalStorage();
	}
	else {
		logger.error('Failed to create schemas');
		return;
	}
}

function fetchCubes() {
	var connections = JSON.parse(localStorage.getItem('schemas'));
	var keys = [];

	for (var i = 0, iLen = connections.length; i < iLen; i++) {
		var connection = connections[i];
		for (var j = 0, jLen = connection.catalogs.length; j < jLen; j++) {
			var catalog = connection.catalogs[j];
			for (var k = 0, kLen = catalog.schemas.length; k < kLen; k++) {
				var schema = catalog.schemas[k];
				for (var l = 0, lLen = schema.cubes.length; l < lLen; l++) {
					var cube = schema.cubes[l];
                    keys.push(connection.name + '/' + catalog.name + '/' +
                        ((schema.name === '' || schema.name === null) ? null : schema.name) +
                        '/' + encodeURIComponent(cube.name));
				}
			}
		}
	}

	return keys;
}

function setMetadataLocalStorage() {
	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
	var cookieJar = request.jar();
	var keys = fetchCubes();
	var len = keys.length;

	cookieJar.setCookie(jsessionid, url);

	for (var i = 0; i < len; i++) {
		getMetadata(cookieJar, keys[i]);
	}
}

function getSchemas(cookieJar, callback) {
	request({
		method: 'GET',
		uri: url,
		jar: cookieJar
	}, 
	function(error, response, body) {
		if (!error && response.statusCode === 200) {
			if (callback && typeof(callback === 'function')) {
				callback(error, response.body);
				setSchemasLocalStorage(error, response.body);
			}
			else {
				setSchemasLocalStorage(error, response.body);
			}
		}
		else {
		}
	});
}

function getMetadata(cookieJar, key, callback) {
	request({
		method: 'GET',
		uri: url + '/' + key + '/metadata',
		jar: cookieJar
	}, 
	function(error, response, body) {
		if (!error && response.statusCode === 200) {
			if (callback && typeof(callback === 'function')) {
				callback(error, response.body);
			}
			else {
				logger.log('✔ Metadata schemas successfully created');
				localStorage.setItem('cube.' + key, response.body);
			}
		}
		else {
			logger.error('Failed to create metadata schemas');
			return;
		}
	});
}

module.exports = SchemasRequest;