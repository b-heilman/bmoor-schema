
const fetch = require('node-fetch');
const Generator = require('../../src/Generator.js').default;

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

const cache = [];
for(let i = 0; i < 500; i++){
	cache.push(generator.generate());
}

const readable = [];

fetch('http://localhost:9001/schema', {
	method: 'post',
	body: JSON.stringify(tranMap),
	headers: { 'Content-Type': 'application/json' }
}).then(() => {
	console.log('schema defined');
	
	const start = Date.now();
	while(cache.length){
		readable.push(
			fetch('http://localhost:9001/transform', {
				method: 'post',
				body: JSON.stringify(cache.pop()),
				headers: { 'Content-Type': 'application/json' }
			}).then(res => res.json())
		);
	}
	
	// no more data
	Promise.all(readable)
	.then(res => {
		const stop = Date.now();
		const time = stop - start;
		const count = res.length;

		console.log(`${paramCount} --finish--`, count, time, count / time );
	});
});