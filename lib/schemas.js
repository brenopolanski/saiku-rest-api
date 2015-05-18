'use strict'
/**
 * @module Saiku
 * @submodule SchemasRequest
 * @beta
 */
var request = require('request');
var settings = require('./shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./LocalStorage');
var url;

/**
 * SchemasRequest handle the /discover API endpoint
 *
 * @class SchemasRequest
 * @constructor
 * @param {Object} options A hash of options for the SessionRequest instance
 * @param {String} [options.host] A host name for send API requests
 * @param {String} [options.username] A username for authenticating API requests
 * @param {String} [options.password] A password for authenticating API requests
 */
function SchemasRequest(options) {
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
	url = this._options.host + settings.REST_URL + this._options.username + '/discover';
}

/**
 * Return Schemas
 *
 * @method get
 * @public
 * @param  {Function} callback
 */
SchemasRequest.prototype.get = function(callback) {
	getSchemas(callback);
};

/**
 * Return metadata Schemas
 *
 * @method metadata
 * @public
 * @param  {Function} callback
 */
SchemasRequest.prototype.metadata = function(callback) {
	fetchCubes(function(keys) {
		for (var i = 0, len = keys.length; i < len; i++) {
			getMetadata(keys[i], callback);
		}
	});
};

/**
 * Get Schemas
 *
 * @private
 * @param  {Function} callback
 */
function getSchemas(callback) {
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
}

/**
 * Get metadata Schemas
 *
 * @private
 * @param  {String} key The name of each cube
 * @param  {Function} callback
 */
function getMetadata(key, callback) {
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
			callback(error, response.body);
		}
		else {
			callback(error, response.body);
		}
	});
}

/**
 * Fetch cubes and join with schemas
 *
 * @private
 * @param  {Function} callback
 */
function fetchCubes(callback) {
	getSchemas(function(error, data) {
		if (!error) {
			var connections = JSON.parse(data);
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

			callback(keys);
		}
	});
}

module.exports = SchemasRequest;