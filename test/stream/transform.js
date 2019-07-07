
const Generator = require('../../src/Generator.js').default;
const Transformer = require('../../src/Transformer.js').default;

/* target sample
{
	name: '',
	title: '',
	property: {
		hello: '',
		world: ''
	},
	array: [{
		foo: '',
		bar: ''
	}]
}
*/

let generator = new Generator([
	{
		path: 'name',
		generator: 'number.index'
	},
	{
		path: 'title',
		generator: 'string.random'
	},
	{
		path: 'property.hello',
		generator: 'boolean.random'
	},
	{
		path: 'property.world',
		generator: 'number.random'
	},
	{
		path: 'array[].foo',
		generator: 'string.random'
	},
	{
		path: 'array[].bar',
		generator: 'string.random'
	},
	{
		path: 'array[]',
		generator: 'array',
		options: {
			min: 1,
			max: 10
		}
	}
]);

const transformer = new Transformer([
	{
		from: 'name',
		to: 'main.eins'
	},
	{
		from: 'title',
		to: 'main.zwei'
	},
	{
		from: 'foo',
		to: 'map.prop1'
	},
	{
		from: 'property.world',
		to: 'map.prop2'
	},
	{
		from: 'array[].foo',
		to: 'arr[].a'
	},
	{
		from: 'array[].bar',
		to: 'arr[].b'
	}
]);

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
		console.log(count); // , data);
		done();
	}
});

const cache = [];
for(let i = 0; i < 100000; i++){
	cache.push(generator.generate());
}

const readable = new Stream.Readable({objectMode: true})

readable.pipe(transform)
	.pipe(counter);

const start = Date.now();
transform.on('finish', function(){
	const stop = Date.now();
	const time = (stop - start);

	console.log('--finish--', count, time, count / time );
});

while(cache.length){
	readable.push(cache.pop());
}

// no more data
readable.push(null);
