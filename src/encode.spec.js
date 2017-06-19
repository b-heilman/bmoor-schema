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
});
