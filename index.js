const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const logger = require('./logger');
const authenticate = require('./authenticate');
const genres = require('./routes/genres');
const express = require('express');

const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('@hapi/joi');
const app = express();
const port = process.env.PORT || 3000;

// Configuration
// You can use env variables that are mapped via config settings
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Server Password: ' + config.get('mail.password'));
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`); // dev if NODE_ENV not defined

app.set('view engine', 'pug');
app.set('views', './views'); // default - optional

app.use(express.json());
app.use(express.urlencoded({extended: true})); // key=vale&key=value and poplates req.body
app.use(express.static('public'));
app.use(helmet());
app.use('/api/genres', genres);
app.use(logger);
app.use(authenticate);

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    // console.log('Morgan enabled....');
    // have to pass DEBUG=startup
    startupDebugger('Morgan enabled...');
}

// Db work have to pass DEBUG=db
dbDebugger('Connected to the database');
// For multiple db messages export DEBUG=app:startup,app:db or app:*

app.get('/', (req, res) => {
    // res.send('Hello world!');
    res.render('index', {title: 'My express app', message: 'Hello world!'});
});





app.listen(port, () => console.log(`Listening on port ${port}...`));
