describe('bmoor-schema::Path', function(){
	var Path = bmoorSchema.Path;

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

		expect( (new Path('eins[]zwei')).flatten( obj ) )
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

		expect( (new Path('eins[]zwei[]')).flatten( obj ) )
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

		( new Path('eins[]zwei[]value') ).exec( obj, fn )

		expect( sum ).toBe( 10 );
	});
});
