
const bmoor = require('bmoor');
const Path = require('./Path.js').default;
const Writer = require('./path/Writer.js').default;

const generators = {
	constant: function(cfg){
		let value = cfg.value;
		return function(){
			return value;
		};
	},
	string: {
		random: function(){
			return function(){
				return 'random string';
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

		let accessors = path.tokenizer.getAccessors();
		let name = accessors[0].join('.');
		let field = this.fields[name];

		if (field) {
			field.addPath(path, generator);
		} else {
			field = new Writer(accessors.shift());

			field.addChild(accessors, generator);

			this.fields[name] = field; 
		}
	}

	generate(){
		let rtn = {};

		for(let f in this.fields){
			let field = this.fields[f];

			field.generateOn(rtn);
		}

		return rtn;
	}
}

module.exports = {
	default: Generator,
	generators: generators
};
