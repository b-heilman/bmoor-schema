describe('bmoor-schema.encode', function(){
	var encode = bmoorSchema.encode;

	it('should work correctly with an object', function(){
		var encoding = encode({
				foo: 'bar',
				arr: [
					{ first: 1 },
					{ second: 2 }
				],
				obj: {
					foo: true
				},
				multi: [
					[ 'val', 'ue' ]
				]
			});

		expect( encoding.length ).toBe( 4 );
	});

	it('should ignore null and undefined values', function() {
		var encoding = encode({
			foo: 'bar',
			nullObj: null,
			undefinedObj: undefined
		});

		expect(encoding.length).toBe(1);
		expect(encoding).toEqual([{path: 'foo', type: 'string', sample: 'bar'}]);
	});
});
