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

SchemasRequest.prototype.get = function(callback) {
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
			setSchemasLocalStorage(error, response.body);
			callback(error, response.body);
		}
		else {
			setSchemasLocalStorage(error, response.body);
			callback(error, response.body);
		}
	});
};

SchemasRequest.prototype.metadata = function(callback) {
	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
	var cookieJar = request.jar();
	var keys = JSON.parse(localStorage.getItem('schemasKey'));

	cookieJar.setCookie(jsessionid, url);

	for (var i = 0, len = keys.length; i < len; i++) {
		request({
			method: 'GET',
			uri: url + '/' + keys[i] + '/metadata',
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
	}
};

function setSchemasLocalStorage(error, data) {
	if (!error) {
		logger.log('✔ Schemas successfully created');
		localStorage.setItem('schemas', data);
		fetchCubes();
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
                    key = connection.name + '/' + catalog.name + '/' +
                        ((schema.name === '' || schema.name === null) ? null : schema.name) +
                        '/' + encodeURIComponent(cube.name);

                    keys.push(key);

                    // console.log(key);
                    // setMetadataLocalStorage(key);
				}
			}
		}
	}

	localStorage.setItem('schemasKey', keys);
}

function setMetadataLocalStorage(key) {
	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
	var cookieJar = request.jar();

	cookieJar.setCookie(jsessionid, url);

	request({
		method: 'GET',
		uri: url + '/' + key + '/metadata',
		jar: cookieJar
	}, 
	function(error, response, body) {
		if (!error && response.statusCode === 200) {
			// console.log(response.body);
			// localStorage.setItem('cube.' + key, response.body);
		}
		else {
			// console.log(response.body);
		}
	});
}

module.exports = SchemasRequest;