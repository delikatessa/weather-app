'use strict';

require('dotenv').load();

const yargs = require('yargs');

const geocode = require('./apis/geocode');

const argv = yargs
	.options({
		a: {
			demand: true,
			alias: 'address',
			describe: 'Address to fetch the weather for',
			string: true,
		},
	})
	.help()
	.alias('help', 'h').argv;

geocode
	.geocodeAddress(argv.a)
	.then(results => {
		console.log(JSON.stringify(results, undefined, 2));
	})
	.catch(errorMessage => {
		console.log(errorMessage);
	});
