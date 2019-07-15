
const Transformer = require('../../src/Transformer.js').default;

const express = require('express');
const server = express();
const bodyParser = require('body-parser');

server.use(bodyParser.json());

const router = express.Router();

let transformer = null;

router.post('/schema', function(req, res){
	console.log('schema defined');

	transformer = new Transformer(req.body);
	res.send('OK');
});

router.post('/transform', function(req, res){
	console.log('transforming');

	transformer.go(req.body)
	.then(json => {
		res.json(json);
	});
});

server.use(router);

server.listen(9001);

module.exports = router;