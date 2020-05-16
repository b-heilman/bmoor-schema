
const {Manager} = require('bmoor-mockery/src/manager.js');

const characterSet = '#$?<>()"\'\\ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

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

const manager = new Manager({
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
});

module.exports = {
	manager
};
