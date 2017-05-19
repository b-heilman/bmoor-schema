describe('bmoor-schema.Mapper', function(){
	var Mapping = bmoorSchema.Mapping;

	it('should be defined', function(){
		expect( Mapping ).toBeDefined();
	});

	it('should instantiate correctly with a hash', function(){
		var mapping = new Mapping(
				'eins',
				'zwei'
			),
			to = {},
			from = {
				zwei: 2
			};

		mapping.go( to, from );

		expect( to.eins ).toBe( 2 );
	});

	it('should icorrectly process an array', function(){
		var mapping = new Mapping(
				'eins[]one',
				'zwei[]two'
			),
			to = {},
			from = {
				zwei: [
					{ two: 2 }
				]
			};

		mapping.go( to, from );

		expect( to.eins[0].one ).toBe( 2 );
	});

	it('should correctly process a multi value array', function(){
		var mapping = new Mapping(
				'eins[]one',
				'zwei[]two'
			),
			to = {},
			from = {
				zwei: [
					{ two: 2 },
					{ two: 3 }
				]
			};

		mapping.go( to, from );

		expect( to.eins[0].one ).toBe( 2 );
		expect( to.eins[1].one ).toBe( 3 );
	});

	it('should correctly process with a nothing after array', function(){
		var mapping = new Mapping(
				'eins[]',
				'zwei[]'
			),
			to = {},
			from = {
				zwei: [
					1,
					2,
					3
				]
			};

		mapping.go( to, from );

		expect( to.eins[0] ).toBe( 1 );
		expect( to.eins[1] ).toBe( 2 );
		expect( to.eins[2] ).toBe( 3 );
	});

	it('should correctly process multi tiered array', function(){
		var mapping = new Mapping(
				'eins[][]',
				'zwei[][]'
			),
			to = {},
			from = {
				zwei: [
					[1,2],
					[3,4],
					[5,6]
				]
			};

		mapping.go( to, from );

		expect( to.eins[0] ).toEqual( [1,2] );
		expect( to.eins[1] ).toEqual( [3,4] );
		expect( to.eins[2] ).toEqual( [5,6] );
	});

	it('should correctly process multi tiered array with properties', function(){
		var mapping = new Mapping(
				'eins[]foo[]bar',
				'zwei[][]'
			),
			to = {},
			from = {
				zwei: [
					[1,2],
					[3,4],
					[5,6]
				]
			};

		mapping.go( to, from );

		expect( to.eins[0].foo ).toEqual([
			{ bar: 1 },
			{ bar: 2 }
		]);
		expect( to.eins[1].foo ).toEqual([
			{ bar: 3 },
			{ bar: 4 }
		]);
		expect( to.eins[2].foo ).toEqual([
			{ bar: 5 },
			{ bar: 6 }
		]);
	});

	describe('array methods', function(){
		it('should allow picking first', function(){
			var mapping = new Mapping(
					'eins[first]',
					'zwei[]'
				),
				to = {},
				from = {
					zwei: [
						{ two: 2 },
						{ two: 3 }
					]
				};

			mapping.go( to, from );

			expect( to.eins.two ).toBe( 2 );
		});

		it('should allow picking last', function(){
			var mapping = new Mapping(
					'eins[last]value',
					'zwei[]two'
				),
				to = {},
				from = {
					zwei: [
						{ two: 2 },
						{ two: 3 }
					]
				};

			mapping.go( to, from );

			expect( to.eins.value ).toBe( 3 );
		});

		it('should allow picking [n] element', function(){
			var mapping = new Mapping(
					'eins[pick:1]value',
					'zwei[]two'
				),
				to = {},
				from = {
					zwei: [
						{ two: 2 },
						{ two: 3 },
						{ two: 4 }
					]
				};

			mapping.go( to, from );

			expect( to.eins.value ).toBe( 3 );
		});

		it('should allow merging', function(){
			var mapping = new Mapping(
					'eins[][merge]',
					'zwei[][]two'
				),
				to = {},
				from = {
					zwei: [
						[
							{ two: 2 },
							{ two: 3 }
						],
						[
							{ two: 4 },
							{ two: 5 }
						]
					]
				};

			mapping.go( to, from );

			expect( to.eins ).toEqual( [2,3,4,5] );
		});
	});
});
