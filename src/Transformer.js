
const {encode} = require('./encode/bmoorSchema.js');
const {Mapper} = require('./path/Mapper.js');
const {Tokenizer} = require('./path/Tokenizer.js');

class Transformer {
	constructor(transformations = []){
		this.mapper = new Mapper(transformations);
	}

	addMapping(from, to){
		this.mapper.addPairing(from, to);
	}

	go(from, to, ops){
		return this.mapper.go(from, to, ops);
	}
}

module.exports = {
	template: function(obj){
		const root = {
			properties: [],
			children: {}
		};
		const encoded = encode(obj);

		encoded.forEach(p => {
			let tokenized = new Tokenizer(p.path);
			let chunks = tokenized.chunk();

			let r = root;
			while(chunks.length){
				let chunk = chunks.shift();

				if (chunk.type !== 'linear'){
					if (chunks.length){
						let child = r.children[chunk.path];

						if (!child){
							child = {
								properties: [],
								children: {}
							};

							r.children[chunk.path] = child;
						}

						r = child;
					} else {
						r.children[chunk.path] = null;
					}
				} else {
					r.properties.push(p.path);
				}
			}
		});

		return root;
	},
	Transformer,
	default: Transformer
};
