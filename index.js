const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');

/* LOAD ENVIRONMENT VARIABLES */
require('dotenv').config();

const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
})

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello world!',
  });
});

app.disable('x-powered-by');
app.listen(process.env.PORT || 3000);