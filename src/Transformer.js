
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

	go(from, to){
		return this.mapper.go(from, to);
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

				if (chunks.length){
					let child = r.children[chunk];

					if (!child){
						child = {
							properties: [],
							children: {}
						};

						r.children[chunk] = child;
					}

					r = child;
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
