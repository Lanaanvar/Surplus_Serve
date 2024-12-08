const app = require('./server');

// Export the app as a serverless function
module.exports = (req, res) => app(req, res);
