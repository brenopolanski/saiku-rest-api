'use strict';

var request = require('request');
var settings = require('./shared/settings');
var LocalStorage = require('node-localstorage').LocalStorage;

var localStorage = new LocalStorage('./LocalStorage');
var url;

function MDXRequest(options) {
	this._options = options || {};

	// url = this._options.host + settings.REST_URL + 'api/query/query123';
	url = this._options.host + settings.REST_URL + 'api/query/execute';
	
	return this;
}

MDXRequest.prototype.open = function(callback) {
	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
	var cookieJar = request.jar();

	cookieJar.setCookie(jsessionid, url);

	request({
		method: 'POST',
		uri: url,
		jar: cookieJar,
		form: {
			json: JSON.stringify({ 
				cube: {
					connection: 'foodmart', 
					catalog: 'FoodMart', 
					schema: 'FoodMart', 
					name: 'Sales'
				}, 
				name: 'query123'
			})
		}
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

MDXRequest.prototype.execute = function(callback) {
	var jsessionid = request.cookie(localStorage.getItem('jsessionid'));
	var cookieJar = request.jar();

	cookieJar.setCookie(jsessionid, url);

	request({
		method: 'POST',
		uri: url,
		jar: cookieJar,

		body: JSON.stringify({ 
				cube: {
					connection: 'foodmart', 
					catalog: 'FoodMart', 
					schema: 'FoodMart', 
					name: 'Sales'
				}, 
				name: 'query1234',
				mdx: 'WITH SET [~ROWS] AS {[Time].[Time].[Year].Members} SELECT NON EMPTY {[Measures].[Unit Sales]} ON COLUMNS, NON EMPTY [~ROWS] ON ROWS FROM [Sales]',
				queryType: 'OLAP',
				type: 'MDX'
			}),

		headers: {
			'Accept': 'application/json',
			'content-type': 'application/json'
		}
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