const http = require('http');
const fs = require('fs');
const path = require('path');

const helpers = require('./helpers');

module.exports = () => {
  const middlewares = [];

  const server = http.createServer((req, res) => {
    res.json = (data) => {
      res.end(JSON.stringify(data));
    };
    helpers.processMiddlewares(req, res, 0, middlewares);
  });

  return {
    use: helpers.createRoutingMethod('USE', middlewares),
    get: helpers.createRoutingMethod('GET', middlewares),
    post: helpers.createRoutingMethod('POST', middlewares),
    listen: server.listen.bind(server)
  };
};

module.exports.static = (clientDirectory) => (req, res, next) => {
  let url = req.url;
  if(url === '/') {
    url = '/index.html';
  }
  fs.readFile(path.join(clientDirectory, url), 'utf8', (err, data) => {
    if(err) {
      next();
      return;
    }
    res.end(data);
  })
};
