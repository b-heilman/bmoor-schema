
const Generator = require('../../src/Generator.js').default;
const Transformer = require('../../src/Transformer.js').default;

const genMap = [];
const tranMap = [];

const paramCount = 80;
for (i = 0; i < paramCount; i++){
	genMap.push({
		path: 'attr'+i,
		generator: 'string.random'
	});

	tranMap.push({
		from: 'attr'+i,
		to: 'prop'+i
	});
}

let generator = new Generator(genMap);

const transformer = new Transformer(tranMap);

var Stream = require('stream');
var transform = new Stream.Transform({objectMode: true});

transform._transform = function (chunk, encoding, done) {
	transformer.go(chunk, {}).then(to => {
		this.push(to);

		done();
	});
}

let count = 0;
var counter = new Stream.Writable({
	objectMode: true,
	write: function(data, _, done){
		count++;
		// console.log(count); //, data);
		done();
	}
});

const cache = [];
for(let i = 0; i < 10000; i++){
	cache.push(generator.generate());
}

const readable = new Stream.Readable({objectMode: true})

readable.pipe(transform)
	.pipe(counter);

const start = Date.now();
transform.on('finish', function(){
	const stop = Date.now();
	const time = (stop - start);

	console.log(`${paramCount} --finish--`, count, time, count / time );
});

while(cache.length){
	readable.push(cache.pop());
}

// no more data
readable.push(null);
