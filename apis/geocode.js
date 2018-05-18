'use strict';

require('dotenv').load();

const request = require('request');
const weather = require('./weather');

module.exports = {
	geocodeAddress: address => {
		return new Promise((resolve, reject) => {
			request(
				{
					url: `${process.env.GOOGLE_GEOCODE_API}?address=${encodeURIComponent(address)}n&key=${
						process.env.GOOGLE_API_KEY
					}`,
					json: true,
				},
				(error, response, body) => {
					if (error) {
						reject(error.message);
					} else if (body.status !== 'OK') {
						reject(body.status || body);
					} else {
						let locations = body.results.map(result => {
							return {
								address: result.formatted_address,
								latitude: result.geometry.location.lat,
								longitude: result.geometry.location.lng,
							};
						});

						// for (let location of locations) {
						// 	weather.getWeather(location.latitude, location.longitude, (errorMessage, weather) => {
						// 		location.weather = errorMessage ? errorMessage : weather;
						// 		console.log('test');
						// 	});
						// }
						resolve(locations);
					}
				}
			);
		});
	},
};
