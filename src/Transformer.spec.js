
const {Transformer, template} = require('./Transformer.js');

describe('bmoor-schema.Transformer', function(){
	
	it('should be defined', function(){
		expect( Transformer ).toBeDefined();
	});

	it('should instantiate correctly with an array', function(){
		const transformer = new Transformer([
			{ 
				from: 'bar',
				to: 'foo'
			}, { 
				to: 'eins',
				from: 'zwei'
			}
		]);
		const to = {};
		const from = {
			bar: 1,
			zwei: 2
		};

		transformer.go(from, to);

		expect( to.foo ).toBe( 1 );
		expect( to.eins ).toBe( 2 );
	});

	it('should run correctly with delayed routes', function(){
		var transformer = new Transformer(),
			to = {},
			from = {
				bar: 1,
				zwei: 2
			};
		
		transformer.addMapping('bar', 'foo');
		transformer.addMapping('zwei', 'eins');

		transformer.go(from, to);

		expect( to.foo ).toBe( 1 );
		expect( to.eins ).toBe( 2 );
	});

	describe('multi tiered routes', function(){
		it('should work on the from', function(){
			var transformer = new Transformer(),
				to = {},
				from = {
					foo: {
						bar: 1,
						hello: 2
					}
				};

			transformer.addMapping('foo.bar',  'eins');
			transformer.addMapping('foo.hello', 'zwei');
			transformer.go(from, to);
			
			expect(to.eins).toBe( 1 );
			expect(to.zwei).toBe( 2 );
		});

		it('should work on the to', function(){
			var transformer = new Transformer(),
				to = {},
				from = {
					foo: 1,
					bar: 2
				};

			transformer.addMapping('foo', 'foo.eins');
			transformer.addMapping('bar', 'foo.zwei');
			transformer.go(from, to);
			
			expect(to.foo.eins).toBe( 1 );
			expect(to.foo.zwei).toBe( 2 );
		});

		it('should copy over objects, not just scalars', function(){
			var transformer = new Transformer(),
				to = {},
				from = {
					foo: {
						eins: 1,
						zwei: 2
					}
				};

			transformer.addMapping('foo', 'bar');
			transformer.go(from, to);
			
			expect( to.bar.eins ).toBe( 1 );
			expect( to.bar.zwei ).toBe( 2 );
		});
	});

	describe('::template', function(){
		it('should work', function(){
			const t = template({
				person: {
					fname: 'Brian',
					lname: 'Halloman'
				},
				tools: [{
					name: 'ok',
					sublist: [{
						foo: 'bar'
					}]
				}],
				properties: [{
					path: 'foo.bar',
					something: 'orOther'
				}],
				strings: [
					'foo',
					'bar'
				]
			});

			expect({
				'properties': [{
					path: 'person.fname',
					value: 'Brian'
				},{
					path: 'person.lname',
					value: 'Halloman'
				}],
				'children': {
					'tools[]': {
						'properties': [{
							path: 'tools[].name',
							value: 'ok'
						}],
						'children': {
							'sublist[]': {
								'properties': [{
									path: 'tools[].sublist[].foo',
									value: 'bar'
								}],
								'children': {}
							}
						}
					},
					'properties[]': {
						'properties': [{
							path: 'properties[].path',
							value: 'foo.bar'
						}, {
							path: 'properties[].something',
							value: 'orOther'
						}],
						'children': {}
					},
					'strings[]': {
						properties: null,
						value: 'foo',
						children: {}
					}
				}
			}).toEqual(t);
		});
	});
	/*
	describe('arrays in routes', function(){
		it('should copy shallow arrays', function(){
			var transformer = new Transformer(),
				to = {},
				from = {
					test: [
						'hello',
						'world'
					]
				};

			transformer.addMapping( 'foo[]', 'test[]' );
			transformer.go( to, from );
			
			expect( to.foo ).toEqual([
				'hello',
				'world'
			]);
		});
	
		it('should copy and change structure', function(){
			var transformer = new Transformer(),
				to = {},
				from = {
					test: [
						'hello',
						'world'
					]
				};
			
			transformer.addMapping( 'foo[]value', 'test[]' );
			transformer.go( to, from );
			
			expect( to.foo ).toEqual([
				{value:'hello'},
				{value:'world'}
			]);
		});
		
		it('should simplify structure', function(){
			var transformer = new Transformer(),
				to = {},
				from = {
					test: [
						{ value: 'hello' },
						{ value: 'world' }
					]
				};
			
			transformer.addMapping( 'foo[]', 'test[]value' );
			transformer.go( to, from );
			
			expect( to.foo ).toEqual([
				'hello',
				'world'
			]);
		});
		
		it('should work with multiple properties', function(){
			var transformer = new Transformer(),
				to = {},
				from = {
					test: [
						{ foo: 'hello', doop: 'eins' },
						{ foo: 'world', doop: 'zwei' }
					]
				};
			
			transformer.addMapping( 'foo[]bar', 'test[]foo' );
			transformer.addMapping( 'foo[]hello.world', 'test[]doop' );
			transformer.go( to, from );
			
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
			var transformer = new Transformer(),
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
			
			transformer.addMapping( 'foo[]bar[]', 'test[]foo[]bar' );
			transformer.go( to, from );
			
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
			var transformer = new Transformer(),
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
			transformer.addMapping( 'foo[][]', 'test[]foo[]bar' );
			transformer.go( to, from );
			expect( to.foo ).toEqual([
				[ 1, 2 ],
				[ 3, 4 ]
			]);
		});
		
		it('should be able to merge arrays', function(){
			var transformer = new Transformer(),
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
			transformer.addMapping( 'foo[][merge]', 'test[]foo[]bar' );
			transformer.go( to, from );
			expect( to.foo ).toEqual([ 1, 2, 3, 4 ]);
		});

		describe('leading array', function(){
			it('should work with stacked arrays', function(){
				var transformer = new Transformer(),
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
				transformer.addMapping( '[][]', '[]foo[]bar' );
				transformer.go( to, from );
				expect( to ).toEqual([
					[ 1, 2 ],
					[ 3, 4 ]
				]);
			});
			
			it('should be able to merge arrays', function(){
				var transformer = new Transformer(),
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
				transformer.addMapping( '[][merge]', 'test[]foo[]bar' );
				transformer.go( to, from );
				expect( to ).toEqual([ 1, 2, 3, 4 ]);
			});
		});	
	});
	*/
});
