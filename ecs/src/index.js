// Set default node environment to development
const express = require('express');
const http = require('http');

// Setup server
var app = express();
var server = http.createServer(app);
//get .env file
require('dotenv').config();

//  Install our routes
require('./config/express')(app);
require('./routes')(app);

const startServer = () => {
  app.server = server.listen(80, () => {
    console.log('Express server listening on port 80');
  });
};

// Start server
console.log('Starting server');
try {
  startServer();
} catch (error) {
  console.log(`Server failed to start due to error: ${error}`);
}

module.exports = app;
