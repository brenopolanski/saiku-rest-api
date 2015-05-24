'use strict';
/**
 * A Saiku REST API client for Node.js
 *
 * @example
 * 		var saiku = new Saiku({ host: 'http://localhost:8081' });
 * 		saiku.schemas().get(function(error, data) {
 * 			if (!error) {
 * 				console.log(data);
 * 			}
 * 		});
 *
 * @module Saiku
 * @main Saiku
 * @beta
 */

// Pull in request module constructors
var _ = require('underscore');
var SessionRequest = require('./lib/session');
var SchemasRequest = require('./lib/schemas');
var RepositoryRequest = require('./lib/repository');
var ExportRequest = require('./lib/export');
var MDXRequest = require('./lib/mdx');

var defaults = {
	host: 'http://localhost:8080',
	pathName: '/pentaho/plugin/saiku/api/',
	username: 'admin',
	password: 'admin'
};

/**
 * The base constructor for the Saiku API service
 *
 * @class Saiku
 * @constructor
 * @uses SchemasRequest
 * @uses RepositoryRequest
 * @uses ExportRequest
 * @uses MDXRequest
 * @param {Object} options An options hash to configure the instance
 * @param {String} [options.host] A host name for send API requests
 * @param {String} [options.username] A username for authenticating API requests
 * @param {String} [options.password] A password for authenticating API requests
 */
function Saiku(options) {
	if (this instanceof Saiku === false) {
		return new Saiku(options);
	}

	this._options = _.extend({}, defaults, options);

	return this;
}

/**
 * Start a request against the `/session` endpoint
 *
 * @method session
 * @param {Object} [options] An options hash for a new SessionRequest
 * @return {SessionRequest} A SessionRequest instance
 */
Saiku.prototype.session = function(options) {
	options = options || {};
	options = _.extend(options, this._options);
	return new SessionRequest(options);
};

/**
 * Start a request against the `/discover` endpoint
 *
 * @method schemas
 * @param {Object} [options] An options hash for a new SchemasRequest
 * @return {SchemasRequest} A SchemasRequest instance
 */
Saiku.prototype.schemas = function(options) {
	options = options || {};
	options = _.extend(options, this._options);
	return new SchemasRequest(options);
};

/**
 * Start a request against the `/api/repository` endpoint
 *
 * @method repository
 * @param {Object} [options] An options hash for a new RepositoryRequest
 * @return {RepositoryRequest} A RepositoryRequest instance
 */
Saiku.prototype.repository = function(options) {
	options = options || {};
	options = _.extend(options, this._options);
	return new RepositoryRequest(options);
};

/**
 * Start a request against the `/api/query/admin/export` endpoint
 *
 * @method export
 * @param {Object} [options] An options hash for a new ExportRequest
 * @return {ExportRequest} A ExportRequest instance
 */
Saiku.prototype.export = function(options) {
	options = options || {};
	options = _.extend(options, this._options);
	return new ExportRequest(options);
};

/**
 * Start a request against the `/api/query/execute` endpoint
 *
 * @method mdx
 * @param {Object} [options] An options hash for a new MDXRequest
 * @return {MDXRequest} A MDXRequest instance
 */
Saiku.prototype.mdx = function(options) {
	options = options || {};
	options = _.extend(options, this._options);
	return new MDXRequest(options);
};

module.exports = Saiku;