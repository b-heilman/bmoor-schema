
const // bmoor = require('bmoor'),
	generators = {
		'string': {

		},
		'number': {

		},
		'boolean': {

		} 
	};

class Generator {

	constructor( fields ){
		this.fields = fields || [];
	}

	/*
		path:
		type:
		---
		generator
		options
		||
		value
		||
		template (v2)
		||
		factory
	*/
	addField( field ){
		this.fields.push( field );
	}

	process(){
		
	}
}

module.exports = {
	default: Generator,
	generators: generators
};
