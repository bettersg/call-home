const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const userRoutes = require('./routes/User');
const callRoutes = require('./routes/Call');

const app = express();

// Env vars
const { PORT = 3000, STATIC_DIR = 'static' } = process.env;

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// This gets populated in a docker build
app.use(express.static(STATIC_DIR));
app.use('/users', userRoutes);
app.use('/twilio', callRoutes);

try {
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });

  // TODO this is just for setting things up
  require('../setupDemo')()
    .catch(console.error);
} catch (err) {
  console.error(err);
  throw err;
}
