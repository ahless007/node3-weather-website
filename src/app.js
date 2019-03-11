const express = require('express');
const path = require('path');
const hbs = require('hbs');

const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

const app = express();
const port = process.env.PORT || 3000;

// Define path for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather App',
		name: 'Alexander Garuba'
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Me',
		name: 'Alexander Garuba'
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help',
		message: 'This is some helpful text',
		name: 'Alexander Garuba'
	});
});

app.get('/weather', (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: 'You must provide a address'
		});
	}

	geocode(
		req.query.address,
		(error, { latitude, longitude, location } = {}) => {
			if (error) {
				return res.send({ error });
			}
			forecast(latitude, longitude, (error, forecastData) => {
				if (error) {
					return res.send({ error });
				}

				res.send({
					forecast: forecastData,
					location,
					address: req.query.address
				});
			});
		}
	);
});

app.get('/product', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term'
		});
	}

	console.log(req.query.search);
	res.send({
		products: []
	});
});

app.listen(port, () => {
	console.log('server is up port ' + port);
});
