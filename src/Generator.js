
const bmoor = require('bmoor');
const Path = require('./Path.js').default;
const Writer = require('./path/Writer.js').default;

const characterSet = '#$?<>()"\'\\ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const stringConstants = [
	'hello', 'world', 'foo', 'bar',
	'eins', 'zwei', 'drei', 'fier',
	function(size){
		const length = size || Math.floor(Math.random() * 10);

		let rtn = ''
		for (let i = 0; i < length; i++ ) {
      		rtn += characterSet.charAt(
      			Math.floor(Math.random() * characterSet.length)
      		);
   		}

   		return rtn;
	}
];

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
				const length = cfg.length || Math.floor(Math.random() * 10);
				const rtn = [];

				for (let i = 0; i < length; i++){
					let val = stringConstants[Math.floor(Math.random() * stringConstants.length)];
				
					if (bmoor.isFunction(val)){
						rtn.push(val(cfg.size));
					} else {
						rtn.push(val);
					}
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
