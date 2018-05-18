('use strict');

require('dotenv').load();

const yargs = require('yargs');
const axios = require('axios');

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

var geocodeUrl = `${process.env.GOOGLE_GEOCODE_API}?address=${encodeURIComponent(
	argv.address
)}&key=${process.env.GOOGLE_API_KEY}`;

axios
	.get(geocodeUrl)
	.then(response => {
		if (response.data.status !== 'OK') {
			throw new Error(response.data.status);
		}

		let promises = [];
		response.data.results.forEach(result => {
			let weatherUrl = `${process.env.DARK_SKY_API}/${process.env.DARK_SKY_API_KEY}/${
				result.geometry.location.lat
			},${result.geometry.location.lng}?units=auto`;

			promises.push(
				axios.get(weatherUrl).then(response => {
					return {
						address: result.formatted_address,
						summary: response.data.currently.summary,
						temperature: response.data.currently.temperature,
					};
				})
			);
		});

		return axios.all(promises);
	})
	.then(results => console.log(results))
	.catch(error => {
		if (error.code === 'ENOTFOUND') {
			console.log('Unable to connect to API servers.');
		} else {
			console.log(error.message);
		}
	});
