'use strict';

var _ = require('underscore');
var SchemasRequest = require('./lib/schemas');
var RepositoryRequest = require('./lib/repository');

var defaults = {
	host: 'http://localhost:8080',
	pathName: '/pentaho/plugin/saiku/api/',
	username: 'admin',
	password: 'admin'
};

function Saiku(options) {
	if (this instanceof Saiku === false) {
		return new Saiku(options);
	}

	this._options = _.extend({}, defaults, options);

	return this;
}

Saiku.prototype.schemas = function(options) {
	options = options || {};
	options = _.extend(options, this._options);
	return new SchemasRequest(options);
};

Saiku.prototype.repository = function(options) {
	options = options || {};
	options = _.extend(options, this._options);
	return new RepositoryRequest(options);
};

module.exports = Saiku;