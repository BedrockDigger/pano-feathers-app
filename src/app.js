const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');

const dayjs = require('dayjs');
let utc = require('dayjs/plugin/utc')
dayjs.extend(utc);


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const schedule = require('node-schedule');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());


// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

// const today = dayjs().utc().format('d');
// let weekArray;
// if (today === 0 || today === 1 || today === 3 || today === 5) {
//     weekArray = [0, 1, 3, 5];
// }
// if (today === 2 || today === 4 || today === 6) {
//     weekArray = [2, 4, 6];
// }
const rule = schedule.RecurrenceRule({ second: 1, minute: 0, hour: 0, tz: 'Etc/GMT-12' });
schedule.scheduleJob(rule, function () { app.service('receptionist').create() });

module.exports = app;
