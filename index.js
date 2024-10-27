require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const api = require('./myApp');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }) );

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use('/api', api());

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
