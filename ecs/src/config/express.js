const bodyParser = require('body-parser');
const Compression = require('compression');

module.exports = function(app) {
  app.use(Compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
};
