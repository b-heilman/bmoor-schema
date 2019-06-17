
const bmoor = require('bmoor');
const Path = require('./Path.js').default;
const Writer = require('./path/Writer.js').default;

const characterSet = '#$?<>()"\'\\ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(cfg){
	const length = cfg.string || 
		(Math.floor(Math.random() * (cfg.stringLength || 10)) + (cfg.stringMin || 4));

	let rtn = '';
	for (let i = 0; i < length; i++ ) {
  		rtn += characterSet.charAt(
  			Math.floor(Math.random() * characterSet.length)
  		);
	}

	return rtn;
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
				const length = cfg.sentence || 
					(Math.floor(Math.random() * (cfg.sentenceLength || 10)) + (cfg.sentenceMin || 1));

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
			if (!cfg) {
				cfg = {};
			}

			if (!cfg.min){
				cfg.min = 1;
			}

			if (!cfg.max){
				cfg.max = 100;
			}

			return function(){
				let val = Math.random() * (cfg.max - cfg.min);

				return val + cfg.min;
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
		return function(){
			let count = cfg.length || 1;

			if (count < 1){
				count = 1;
			}

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
