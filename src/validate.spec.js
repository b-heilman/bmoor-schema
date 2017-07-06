describe('bmoor-schema::validate', function(){
	var validate = bmoorSchema.validate;

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

		expect( validate(schema,obj) ).toEqual( null );
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

		expect( rtn ).toEqual([
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
				path: 'eins[]value',
				type: 'boolean'
			},{
				path: 'zwei[]value',
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

		expect( rtn ).toEqual( null );
	});

	it('should error with arrays', function(){
		var schema = [{
				path: 'eins[]value',
				type: 'boolean'
			},{
				path: 'zwei[]value',
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

		expect( rtn ).toEqual([
			{
				path: 'eins[]value',
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
});
