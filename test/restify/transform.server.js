
const Transformer = require('../../src/Transformer.js').default;

const restify = require('restify');
const server = restify.createServer();
const bodyParser = require('body-parser');

server.use(bodyParser.json());

let transformer = null;

server.post('/schema', function(req, res, next){
	console.log('schema defined');

	transformer = new Transformer(req.body);

	res.send('OK');
	next();
});

server.post('/transform', function(req, res, next){
	console.log('transforming');

	transformer.go(req.body)
	.then(json => {
		res.json(json);
		next();
	});
});

server.listen(9001);

module.exports = server;