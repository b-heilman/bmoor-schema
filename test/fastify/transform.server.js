
const Transformer = require('../../src/Transformer.js').default;

const fastify = require('fastify')();

fastify.addContentTypeParser('application/json', { parseAs: 'string' }, 
	function (req, body, done) {
		try {
			var json = JSON.parse(body);
			done(null, json);
		} catch (err) {
			err.statusCode = 400;
			done(err, undefined);
		}
	}
);

let transformer = null;

fastify.post('/schema', function(req, res, next){
	console.log('schema defined');

	transformer = new Transformer(req.body);

	res.send('OK');
});

fastify.post('/transform', function(req, res, next){
	console.log('transforming');

	transformer.go(req.body)
	.then(json => {
		res.send(json);
	});
});

fastify.listen(9001);

module.exports = fastify;