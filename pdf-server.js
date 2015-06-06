#!/usr/bin/env node
/*
 * A copy from https://github.com/indexzero/http-server
 */
var colors     = require('colors'),
	httpServer = require('./http-server/http-server'),
	portfinder = require('portfinder'),
	opener = require('opener'),
	argv = require('optimist')
		.boolean('cors')
		.argv;

if (argv.h || argv.help) {
	console.log([
		"usage: http-server [path] [options]",
		"",
		"options:",
		"  -p                 Port to use [8080]",
		"  -a                 Address to use [0.0.0.0]",
		"  -d                 Show directory listings [true]",
		"  -i                 Display autoIndex [true]",
		"  -e --ext           Default file extension if none supplied [none]",
		"  -s --silent        Suppress log messages from output",
		"  --cors             Enable CORS via the 'Access-Control-Allow-Origin' header",
		"  -o [path]          Open browser window after starting the server",
		"  -c                 Cache time (max-age) in seconds [3600], e.g. -c10 for 10 seconds.",
		"                     To disable caching, use -c-1.",
		"",
		"  -P --proxy         Fallback proxy if the request cannot be resolved. e.g.: http://someurl.com",
		"",
		"  -S --ssl           Enable https.",
		"  -C --cert          Path to ssl cert file (default: cert.pem).",
		"  -K --key           Path to ssl key file (default: key.pem).",
		"",
		"  -r --robots        Respond to /robots.txt [User-agent: *\\nDisallow: /]",
		"  -h --help          Print this list and exit."
	].join('\n'));
	process.exit();
}

var port = parseInt(process.env.PORT, 10),
	host = argv.a || '0.0.0.0',
	log = (argv.s || argv.silent) ? (function () {}) : console.log,
	ssl = !!argv.S || !!argv.ssl,
	proxy = argv.P || argv.proxy,
	requestLogger;

if (!argv.s && !argv.silent) {
	requestLogger = function(req, res, error) {
		var date = (new Date).toUTCString();
		if (error) {
			log('[%s] "%s %s" Error (%s): "%s"', date, req.method.red, req.url.red, error.status.toString().red, error.message.red);
		} else {
			log('[%s] "%s %s" "%s"', date, req.method.cyan, req.url.cyan, req.headers['user-agent']);
		}
	};
}

if (!port) {
	portfinder.basePort = 8080;
	portfinder.getPort(function (err, port) {
		if (err) throw err;
		listen(port);
	});
} else {
	listen(port);
}

function listen(port) {
	var options = {
		root: argv._[0],
		cache: argv.c,
		showDir: argv.d,
		autoIndex: argv.i,
		robots: argv.r || argv.robots,
		ext: argv.e || argv.ext,
		logFn: requestLogger,
		proxy: proxy
	};

	if (argv.cors) {
		options.cors = true;
	}

	if (ssl) {
		options.https = {
			cert: argv.C || argv.cert || 'cert.pem',
			key: argv.K || argv.key || 'key.pem'
		};
	}

	var server = httpServer.createServer(options);
	server.listen(port, host, function () {
		var canonicalHost = host === '0.0.0.0' ? '127.0.0.1' : host,
			protocol      = ssl ? 'https:' : 'http:';

		log('Starting up http-server, serving '.yellow
			+ server.root.cyan
			+ (ssl ? (' through'.yellow + ' https'.cyan) : '')
			+ ' on: '.yellow
			+ (protocol + '//' + host + ':' + port).cyan);

		if (typeof proxy === 'string') {
			log('Unhandled requests will be served from: ' + proxy);
		}

		log('Hit CTRL-C to stop the server');
		if (argv.o) {
			opener(
				protocol + '//' + canonicalHost + ':' + port,
				{ command: argv.o !== true ? argv.o : null }
			);
		}
	});
}

if (process.platform === 'win32') {
	require('readline').createInterface({
		input: process.stdin,
		output: process.stdout
	}).on('SIGINT', function () {
		process.emit('SIGINT');
	});
}

process.on('SIGINT', function() {
	log('http-server stopped.'.red);
	process.exit();
});