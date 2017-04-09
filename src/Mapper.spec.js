describe('bmoor-schema.Mapper', function(){
	var Mapper = bmoorSchema.Mapper;

	it('should be defined', function(){
		expect( Mapper ).toBeDefined();
	});

	it('should instantiate correctly with a hash', function(){
		var mapper = new Mapper({
				foo: 'bar',
				eins: 'zwei'
			}),
			to = {},
			from = {
				bar: 1,
				zwei: 2
			};

		mapper.run( to, from );

		expect( to.foo ).toBe( 1 );
		expect( to.eins ).toBe( 2 );
	});

	it('should instantiate correctly with an array', function(){
		var mapper = new Mapper([
				{ to: 'foo', from: 'bar' },
				{ to: 'eins', from: 'zwei' }
			]),
			to = {},
			from = {
				bar: 1,
				zwei: 2
			};

		mapper.run( to, from );

		expect( to.foo ).toBe( 1 );
		expect( to.eins ).toBe( 2 );
	});

	it('should run correctly with delayed routes', function(){
		var mapper = new Mapper(),
			to = {},
			from = {
				bar: 1,
				zwei: 2
			};

		mapper.addMapping( 'foo', 'bar' );
		mapper.addMapping( 'eins', 'zwei' );

		mapper.run( to, from );

		expect( to.foo ).toBe( 1 );
		expect( to.eins ).toBe( 2 );
	});

	describe('multi tiered routes', function(){
		it('should work on the from', function(){
			var mapper = new Mapper(),
				to = {},
				from = {
					foo: {
						bar: 1,
						hello: 2
					}
				};

			mapper.addMapping( 'eins', 'foo.bar' );
			mapper.addMapping( 'zwei', 'foo.hello' );

			mapper.run( to, from );

			expect( to.eins ).toBe( 1 );
			expect( to.zwei ).toBe( 2 );
		});

		it('should work on the to', function(){
			var mapper = new Mapper(),
				to = {},
				from = {
					foo: 1,
					bar: 2
				};

			mapper.addMapping( 'foo.eins', 'foo' );
			mapper.addMapping( 'foo.zwei', 'bar' );

			mapper.run( to, from );

			expect( to.foo.eins ).toBe( 1 );
			expect( to.foo.zwei ).toBe( 2 );
		});

		it('should copy over objects, not just scalars', function(){
			var mapper = new Mapper(),
				to = {},
				from = {
					foo: {
						eins: 1,
						zwei: 2
					}
				};

			mapper.addMapping( 'bar', 'foo' );

			mapper.run( to, from );

			expect( to.bar.eins ).toBe( 1 );
			expect( to.bar.zwei ).toBe( 2 );
		});
	});

	describe('arrays in routes', function(){
		it('should copy shallow arrays', function(){
			var mapper = new Mapper(),
				to = {},
				from = {
					test: [
						'hello',
						'world'
					]
				};

			mapper.addMapping( 'foo[]', 'test[]' );

			mapper.run( to, from );

			expect( to.foo ).toEqual([
				'hello',
				'world'
			]);
		});
	
		it('should copy and change structure', function(){
			var mapper = new Mapper(),
				to = {},
				from = {
					test: [
						'hello',
						'world'
					]
				};

			mapper.addMapping( 'foo[]value', 'test[]' );

			mapper.run( to, from );

			expect( to.foo ).toEqual([
				{value:'hello'},
				{value:'world'}
			]);
		});

		it('should simplify structure', function(){
			var mapper = new Mapper(),
				to = {},
				from = {
					test: [
						{ value: 'hello' },
						{ value: 'world' }
					]
				};

			mapper.addMapping( 'foo[]', 'test[]value' );

			mapper.run( to, from );

			expect( to.foo ).toEqual([
				'hello',
				'world'
			]);
		});

		it('should work with multiple properties', function(){
			var mapper = new Mapper(),
				to = {},
				from = {
					test: [
						{ foo: 'hello', doop: 'eins' },
						{ foo: 'world', doop: 'zwei' }
					]
				};

			mapper.addMapping( 'foo[]bar', 'test[]foo' );
			mapper.addMapping( 'foo[]hello.world', 'test[]doop' );

			mapper.run( to, from );

			expect( to.foo ).toEqual([
				{ 
					bar: 'hello',
					hello: {
						world: 'eins'
					} 
				},
				{ 
					bar: 'world',
					hello: {
						world: 'zwei'
					}
				}
			]);
		});

		it('should work with multiple arrays', function(){
			var mapper = new Mapper(),
				to = {},
				from = {
					test: [
						{ 
							foo: [
								{ bar: 1 },
								{ bar: 2 }
							]
						},
						{ 
							foo: [
								{ bar: 3 },
								{ bar: 4 }
							]
						},
					]
				};

			mapper.addMapping( 'foo[]bar[]', 'test[]foo[]bar' );

			mapper.run( to, from );

			expect( to.foo ).toEqual([
				{ 
					bar: [
						1,
						2
					]
				},
				{ 
					bar: [
						3,
						4
					]
				},
			]);
		});

		it('should work with stacked arrays', function(){
			var mapper = new Mapper(),
				to = {},
				from = {
					test: [
						{ 
							foo: [
								{ bar: 1 },
								{ bar: 2 }
							]
						},
						{ 
							foo: [
								{ bar: 3 },
								{ bar: 4 }
							]
						},
					]
				};

			mapper.addMapping( 'foo[][]', 'test[]foo[]bar' );

			mapper.run( to, from );

			expect( to.foo ).toEqual([
				[ 1, 2 ],
				[ 3, 4 ]
			]);
		});

		it('should be able to merge arrays', function(){
			var mapper = new Mapper(),
				to = {},
				from = {
					test: [
						{ 
							foo: [
								{ bar: 1 },
								{ bar: 2 }
							]
						},
						{ 
							foo: [
								{ bar: 3 },
								{ bar: 4 }
							]
						},
					]
				};

			mapper.addMapping( 'foo[][m]', 'test[]foo[]bar' );

			mapper.run( to, from );

			expect( to.foo ).toEqual([ 1, 2, 3, 4 ]);
		});

		describe('leading array', function(){
			it('should work with stacked arrays', function(){
				var mapper = new Mapper(),
					to = [],
					from = [
						{ 
							foo: [
								{ bar: 1 },
								{ bar: 2 }
							]
						},
						{ 
							foo: [
								{ bar: 3 },
								{ bar: 4 }
							]
						},
					];

				mapper.addMapping( '[][]', '[]foo[]bar' );

				mapper.run( to, from );

				expect( to ).toEqual([
					[ 1, 2 ],
					[ 3, 4 ]
				]);
			});

			it('should be able to merge arrays', function(){
				var mapper = new Mapper(),
					to = [],
					from = {
						test: [
							{ 
								foo: [
									{ bar: 1 },
									{ bar: 2 }
								]
							},
							{ 
								foo: [
									{ bar: 3 },
									{ bar: 4 }
								]
							},
						]
					};

				mapper.addMapping( '[][m]', 'test[]foo[]bar' );

				mapper.run( to, from );

				expect( to ).toEqual([ 1, 2, 3, 4 ]);
			});
		});
	});
});
