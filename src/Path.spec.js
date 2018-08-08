describe('bmoor-schema::Path', function(){
	var Path = require('./Path.js').default;

	it('should not blow up on something that does not need flattened', function(){
		var obj = {
				foo: 'bar',
				world: 43110
			};

		expect( (new Path('world')).flatten( obj ) )
			.toEqual([43110]);

		expect( (new Path('foo')).flatten( obj ) )
			.toEqual(['bar']);
	});

	it('should flatten a simple array', function(){
		var obj = {
				eins: [
					'foo',
					'bar'
				]
			};

		expect( (new Path('eins[]')).flatten( obj ) )
			.toEqual(['foo','bar']);
	});

	it('should flatten properties of a simple array', function(){
		var obj = {
				eins: [
					{ zwei: 'foo' },
					{ zwei: 'bar' }
				]
			};

		expect( (new Path('eins[].zwei')).flatten( obj ) )
			.toEqual(['foo','bar']);
	});

	it('should flatten properties of multiple arrays', function(){
		var obj = {
				eins: [
					{ zwei: [
						'foo' 
					]},
					{ zwei: [
						'bar' 
					]}
				]
			};

		expect( (new Path('eins[].zwei[]')).flatten( obj ) )
			.toEqual(['foo','bar']);
	});

	it('should execute a functiona against properties of multiple arrays', function(){
		var obj = {
				eins: [
					{ zwei: [
						{ value: 1 },
						{ value: 2 }
					]},
					{ zwei: [
						{ value: 3 },
						{ value: 4 }
					]}
				]
			},
			sum = 0,
			fn = function( v ){
				sum += v;
			};

		( new Path('eins[].zwei[].value') ).exec( obj, fn );

		expect( sum ).toBe( 10 );
	});
});
