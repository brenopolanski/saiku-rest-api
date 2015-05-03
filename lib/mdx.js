'use strict';

var request = require('request');
var settings = require('./shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./LocalStorage');
var url;

function MDXRequest(options) {
	var sessionId = JSON.parse(localStorage.getItem('sessionInfo')).sessionid;
	this._options = options || {};
	this._options.queryName = options.queryName || sessionId;

	url = this._options.host + settings.REST_URL + 'api/query/execute';
	
	return this;
}

MDXRequest.prototype.execute = function(callback) {
	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
	var cookieJar = request.jar();

	cookieJar.setCookie(jsessionid, url);

	request({
		method: 'POST',
		uri: url,
		jar: cookieJar,
		headers: {
			'Accept': 'application/json',
			'content-type': 'application/json'
		},
		body: JSON.stringify({ 
			cube: {
				connection: this._options.connectionName,
				catalog: this._options.schemaName,
				schema: this._options.schemaName,
				name: this._options.cubeName,
			}, 
			name: this._options.queryName,
			mdx: this._options.mdx,
			queryType: 'OLAP',
			type: 'MDX'
		})
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

module.exports = MDXRequest;