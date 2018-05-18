'use strict';

const request = require('request');

module.exports = {
	getWeather: (latitude, longitude, callback) => {
		return new Promise((resolve, reject) => {
			request(
				{
					url: `${process.env.DARK_SKY_API}/${
						process.env.DARK_SKY_API_KEY
					}/${latitude},${longitude}?units=auto`,
					json: true,
				},
				(error, response, body) => {
					if (error) {
						reject(error.message);
					} else if (response.statusCode === 200) {
						resolve({
							temperature: body.currently.temperature,
							summary: body.currently.summary,
						});
					} else {
						reject(body);
					}
				}
			);
		});
	},
};
