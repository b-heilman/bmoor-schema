describe('bmoor-schema.encode.bmoorSchema', function(){
	var encode = require('./bmoorSchema.js').default;

	it('should work correctly with an object', function(){
		var encoding = encode({
				foo: 'bar',
				arr: [
					{ first: 1 },
					{ second: 2 }
				],
				obj: {
					foo: true,
					'hello-world': 'hola',
					'boop doop': 'ok',
					'eins.zwei': 12,
					'well_ok': 'snake'
				},
				multi: [
					[ 'val', 'ue' ]
				]
			});

		expect( encoding.length ).toBe( 8 );

		expect( encoding[0].path )
			.toBe('foo');
		expect( encoding[1].path )
			.toBe('arr[].first');
		expect( encoding[2].path )
			.toBe('obj.foo');
		expect( encoding[3].path )
			.toBe('obj["hello-world"]');
		expect( encoding[4].path )
			.toBe('obj["boop doop"]');
		expect( encoding[5].path )
			.toBe('obj["eins.zwei"]');
		expect( encoding[6].path )
			.toBe('obj.well_ok');
		expect( encoding[7].path )
			.toBe('multi[][]');
	});

	it('should allow escaping override', function(){
		var encoding = encode({
				foo: 'bar',
				arr: [
					{ first: 1 },
					{ second: 2 }
				],
				obj: {
					foo: true,
					'hello-world': 'hola',
					'boop doop': 'ok',
					'eins.zwei': 12,
					'well_ok': 'snake'
				},
				multi: [
					[ 'val', 'ue' ]
				]
			},/\./);

		expect( encoding.length ).toBe( 8 );

		expect( encoding[0].path )
			.toBe('foo');
		expect( encoding[1].path )
			.toBe('arr[].first');
		expect( encoding[2].path )
			.toBe('obj.foo');
		expect( encoding[3].path )
			.toBe('obj.hello-world');
		expect( encoding[4].path )
			.toBe('obj.boop doop');
		expect( encoding[5].path )
			.toBe('obj["eins.zwei"]');
		expect( encoding[6].path )
			.toBe('obj.well_ok');
		expect( encoding[7].path )
			.toBe('multi[][]');
	});

	it('should ignore null and undefined values', function() {
		var encoding = encode({
			foo: 'bar',
			nullObj: null,
			undefinedObj: undefined
		});

		expect(encoding.length).toBe(1);
		expect(encoding).toEqual([{
			path: 'foo',
			type: 'string',
			sample: 'bar'
		}]);
	});
});
