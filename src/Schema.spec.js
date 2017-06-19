describe('bmoor-schema::schema', function(){
	var encode = bmoorSchema.encode,
		translate = bmoorSchema.translate;

	it('should encode a basic object correctly', function(){
		var info = encode({
				eins: 1,
				zwei: true,
				drei: 'hello'
			});

		expect( info ).toEqual([
			{
				path: 'eins',
				type: 'number',
				sample: 1
			},
			{
				path: 'zwei',
				type: 'boolean',
				sample: true
			},
			{
				path: 'drei',
				type: 'string',
				sample: 'hello'
			}
		]);

		expect( translate(info) ).toEqual({
			type: 'object',
			properties: {
				eins: {
					type: 'number'
				},
				zwei: {
					type: 'boolean'
				},
				drei: {
					type: 'string'
				}
			}
		});

		info[0].to = 'test.eins';
		info[0].from = 'test.eins_o';

		info[1].to = 'test.zwei';
		info[1].from = 'test.zwei_o';

		info[2].to = 'drei';
		info[2].from = 'foo.bar';

		expect( translate(info) ).toEqual({
			type: 'object',
			properties: {
				test: {
					type: 'object',
					properties: {
						eins: {
							alias: 'test.eins_o',
							type: 'number'
						},
						zwei: {
							alias: 'test.zwei_o',
							type: 'boolean'
						}
					}
				},
				drei: {
					alias: 'foo.bar',
					type: 'string'
				}
			}
		});
	});

	it('should encode an array correctly', function(){
		var info = encode([
				'hello',
				'world'
			]);

		expect( info ).toEqual([
			{
				path: '[]',
				type: 'string',
				sample: 'hello'
			}
		]);

		expect( translate(info) ).toEqual({
			type: 'array',
			items: {
				type: 'string'
			}
		});
	});

	it('should encode a multi level object correctly', function(){
		var info = encode({
				eins: 1,
				foo: {
					zwei: true,
					drei: 'hello'
				}
			});

		expect( info ).toEqual([
			{
				path: 'eins',
				type: 'number',
				sample: 1
			},
			{
				path: 'foo.zwei',
				type: 'boolean',
				sample: true
			},
			{
				path: 'foo.drei',
				type: 'string',
				sample: 'hello'
			}
		]);

		expect( translate(info) ).toEqual({
			type: 'object',
			properties: {
				eins: {
					type: 'number'
				},
				foo: {
					type: 'object',
					properties: {
						zwei: {
							type: 'boolean'
						},
						drei: {
							type: 'string'
						}
					}
				}
			}
		});
	});

	it('should encode an array inside an object correctly', function(){
		var info = encode({
				eins: 1,
				foo: [{
					zwei: true,
					drei: 'hello'
				}]
			});

		expect( info ).toEqual([
			{
				path: 'eins',
				type: 'number',
				sample: 1
			},
			{
				path: 'foo[].zwei',
				type: 'boolean',
				sample: true
			},
			{
				path: 'foo[].drei',
				type: 'string',
				sample: 'hello'
			}
		]);

		expect( translate(info) ).toEqual({
			type: 'object',
			properties: {
				eins: {
					type: 'number'
				},
				foo: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							zwei: {
								type: 'boolean'
							},
							drei: {
								type: 'string'
							}
						}
					}
				}
			}
		});
	});
});
