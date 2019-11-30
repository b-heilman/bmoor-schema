
const {expect} = require('chai');

describe('bmoor-schema::validate', function(){
	const {validate} = require('./validate.js');

	it('return null with no errors', function(){
		var schema = [{
				path: 'eins',
				type: 'boolean'
			},{
				path: 'zwei',
				type: 'number'
			},{
				path: 'foo',
				type: 'string'
			}],
			obj = {
				eins: true,
				zwei: 2,
				foo: 'bar'
			};

		expect( validate(schema,obj) ).to.deep.equal( null );
	});

	it('return an array of errors', function(){
		var schema = [{
				path: 'eins',
				type: 'boolean'
			},{
				path: 'zwei',
				type: 'number'
			},{
				path: 'foo',
				type: 'string'
			}],
			obj = {
				eins: 1,
				zwei: 2,
				foo: 3
			},
			rtn = validate(schema,obj);

		expect( rtn ).to.deep.equal([
			{
				path: 'eins',
				type: 'type',
				value: 1,
				expect: 'boolean'
			},
			{
				path: 'foo',
				type: 'type',
				value: 3,
				expect: 'string'
			}
		]);
	});

	it('should work with arrays', function(){
		var schema = [{
				path: 'eins[].value',
				type: 'boolean'
			},{
				path: 'zwei[].value',
				type: 'number'
			},{
				path: 'foo[]',
				type: 'string'
			}],
			obj = {
				eins: [
					{value:true}
				],
				zwei: [
					{value:2},
					{value:3}
				],
				foo: [
					'bar1',
					'bar2'
				]
			},
			rtn = validate(schema,obj);

		expect( rtn ).to.deep.equal( null );
	});

	it('should error with arrays', function(){
		var schema = [{
				path: 'eins[].value',
				type: 'boolean'
			},{
				path: 'zwei[].value',
				type: 'number'
			},{
				path: 'foo[]',
				type: 'string'
			}],
			obj = {
				eins: [
					{value:4}
				],
				zwei: [
					{value:2},
					{value:3}
				],
				foo: [
					1,
					'bar'
				]
			},
			rtn = validate(schema,obj);

		expect( rtn ).to.deep.equal([
			{
				path: 'eins[].value',
				type: 'type',
				value: 4,
				expect: 'boolean'
			},
			{
				path: 'foo[]',
				type: 'type',
				value: 1,
				expect: 'string'
			}
		]);
	});

	it('should require values to be defined', function(){
		var schema = [{
				path: 'eins[].value',
				type: 'boolean',
				required: true
			},{
				path: 'zwei[].value',
				type: 'number'
			},{
				path: 'foo[]',
				type: 'string'
			}],
			obj = {
				zwei: [
					{value:2},
					{value:3}
				],
				foo: [
					1,
					'bar'
				]
			},
			rtn = validate(schema,obj);

		expect( rtn ).to.deep.equal([
			{
				path: 'eins[].value',
				type: 'missing',
				value: undefined,
				expect: 'boolean'
			},
			{
				path: 'foo[]',
				type: 'type',
				value: 1,
				expect: 'string'
			}
		]);
	});

	it('should allow unrequired to be optional', function(){
		var schema = [{
				path: 'eins[].value',
				type: 'boolean'
			},{
				path: 'zwei[].value',
				type: 'number'
			},{
				path: 'foo[]',
				type: 'string'
			}],
			obj = {
				zwei: [
					{value:2},
					{value:3}
				],
				foo: [
					1,
					'bar'
				]
			},
			rtn = validate(schema,obj);

		expect( rtn ).to.deep.equal([
			{
				path: 'foo[]',
				type: 'type',
				value: 1,
				expect: 'string'
			}
		]);
	});
});
