
const bmoor = require('bmoor');
const Path = require('./Path.js').default;
const Writer = require('./path/Writer.js').default;

const characterSet = '#$?<>()"\'\\ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function getRandomValue(min, max){
	const length = max - min;
	return Math.floor(Math.random() * length) + min;
}

function generateString(cfg){
	const min = cfg.stringMin || 4;
	const max = cfg.stringMax || cfg.stringLength ? 
		cfg.stringLength - cfg.stringMin : 10;
	
	let rtn = '';
	const length = max - min;
	for (let i = 0; i < length; i++ ) {
  		rtn += characterSet.charAt(getRandomValue(0, characterSet.length));
	}

	return rtn;
}

function configure(cfg = {}, min = 1, max = 10){
	if (!('min' in cfg)){
		cfg.min = min;
	}

	if (!('max' in cfg)){
		cfg.max = max;
	}

	return cfg;
}

const generators = {
	constant: function(cfg){
		let value = cfg.value;
		return function(){
			return value;
		};
	},
	string: {
		random: function(cfg = {}){
			return function(){
				const rtn = [];

				const length = cfg.sentence || getRandomValue(
					cfg.sentenceMin || 1,
					cfg.sentenceMax || cfg.sentenceLength ? cfg.sentenceLength - cfg.sentenceMin : 10
				);

				for (let i = 0; i < length; i++){
					rtn.push(generateString(cfg));
				}

				return rtn.join(' ');
			};
		}
	},
	number: {
		index: function(){
			let count = 1;
			return function(){
				return count++;
			};
		},
		random: function(cfg){
			cfg = configure(cfg, 1, 100);

			return function(){
				return getRandomValue(cfg.min, cfg.max);
			};
		}
	},
	boolean: {
		random: function(){
			return function(){
				return Math.random() * 10 % 2 === 0;
			};
		}
	},
	array: function(cfg){
		cfg = configure(cfg, 1, 100);

		return function(){
			let count = cfg.length || getRandomValue(cfg.min, cfg.max);

			let rtn = [];

			while(count){
				rtn.push({});
				count--;
			}
			
			return rtn;
		};
	}
};

class Generator {

	constructor(config){
		this.fields = {};

		config.forEach(cfg => {
			this.addField(
				new Path(cfg.path),
				cfg.generator,
				cfg.options
			);
		});
	}

	/*
		path:
		---
		string: generator
		object: options
		||
		any: value
		||
		function: factory
	*/
	addField(path, generator, options){
		if (bmoor.isString(generator)){
			generator = bmoor.get(generators, generator)(options);
		}

		const accessors = path.tokenizer.getAccessList();
		
		let writer = new Writer(accessors.getFront());
		path = writer.accessor.ref;

		let found = this.fields[path];

		if (found) {
			writer = found;
		} else {
			this.fields[path] = writer; 
		}

		const following = accessors.getFollowing();

		if (following){
			writer.addChild(following, generator);
		} else {
			writer.setGenerator(generator);
		}
		

		return writer;
	}

	generate(){
		let rtn = {};

		for(let f in this.fields){
			let field = this.fields[f];

			field.go(rtn);
		}

		return rtn;
	}
}

module.exports = {
	Generator,
	default: Generator,
	generators: generators
};
