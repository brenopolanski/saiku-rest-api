# A Saiku REST API client for Node.js

This is a client for the [Saiku Analytics REST API](http://community.meteorite.bi/docs/). It is **under active development**, and should be considered beta software. More features are in development, and [**issues**](https://github.com/brenopolanski/saiku-rest-api/issues) are welcome if you find something that doesn't work!

## Purpose

This client is designed to make it easy for your Node.js application to request specific resources from Saiku. It uses a query builder-style syntax to let you craft the request being made to the Saiku endpoints, then returns the API server's response to your application as a JavaScript object.

## Installation

To use the client, install it with [npm](https://www.npmjs.com/):

```sh
npm install --save saiku-rest-api
```

Then, within your application's script files, `require` the module to gain access to it:

```sh
var Saiku = require('saiku-rest-api');
```

> The REST API client requires Node.js version 0.10 or above.

## Using the Client

The module is a constructor, so you can create an instance of the API client bound to the endpoint for your Saiku:

```sh
var Saiku = require('saiku-rest-api');
var saiku = new Saiku({ 
	host: 'http://localhost:8080',
	username: 'admin',
	password: 'admin'
});
```

> Once an instance is constructed, you can chain off of it to construct a specific request.

We support requesting posts using either a callback-style:

```javascript
// Callbacks
saiku.schemas().get(function(error, data) {
	if (!error) {
		// do something with the returned posts
	}
	else {
		// handle error
	}
});
```

## Contributing

Check [CONTRIBUTING.md](https://github.com/brenopolanski/saiku-rest-api/blob/master/CONTRIBUTING.md) for more information.

## History

For detailed changelog, see [Releases](https://github.com/brenopolanski/saiku-rest-api/releases).

## Credits

I thank the following open source project:

* [Saiku UI](https://github.com/OSBI/saiku-ui) - A user interface for the Saiku analytical tool (Apache license version 2).

## License

[MIT License](http://brenopolanski.mit-license.org/) © Breno Polanski
