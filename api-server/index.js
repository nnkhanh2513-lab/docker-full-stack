var restify = require('restify');
var corsMiddleware = require('restify-cors-middleware2');
var server = restify.createServer();
var cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders:['X-App-Version'],
    exposeHeaders:[]
  });
  
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser({ mapParams: true })); // POST params
server.use(restify.plugins.queryParser()); // GET query

const root = require('./routes/roots');
const login = require('./routes/login');
const room = require('./routes/room');

root.applyRoutes(server);
login.applyRoutes(server);
room.applyRoutes(server);

var PORT = 8080;
server.listen(PORT, function() {
    console.log('%s listening at %s', server.name, server.url);
});