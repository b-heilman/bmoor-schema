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
				from: 'eins',
				type: 'number',
				sample: 1
			},
			{
				from: 'zwei',
				type: 'boolean',
				sample: true
			},
			{
				from: 'drei',
				type: 'string',
				sample: 'hello'
			}
		]);

		expect( translate(info) ).toEqual({
			type: 'object',
			properties: {
				eins: {
					alias: 'eins',
					type: 'number'
				},
				zwei: {
					alias: 'zwei',
					type: 'boolean'
				},
				drei: {
					alias: 'drei',
					type: 'string'
				}
			}
		});

		info[0].to = 'test.eins';
		info[1].to = 'test.zwei';

		expect( translate(info) ).toEqual({
			type: 'object',
			properties: {
				test: {
					type: 'object',
					properties: {
						eins: {
							alias: 'eins',
							type: 'number'
						},
						zwei: {
							alias: 'zwei',
							type: 'boolean'
						}
					}
				},
				drei: {
					alias: 'drei',
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
				from: '[]',
				type: 'string',
				sample: 'hello'
			}
		]);

		expect( translate(info) ).toEqual({
			type: 'array',
			items: {
				alias: '[]',
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
				from: 'eins',
				type: 'number',
				sample: 1
			},
			{
				from: 'foo.zwei',
				type: 'boolean',
				sample: true
			},
			{
				from: 'foo.drei',
				type: 'string',
				sample: 'hello'
			}
		]);

		expect( translate(info) ).toEqual({
			type: 'object',
			properties: {
				eins: {
					alias: 'eins',
					type: 'number'
				},
				foo: {
					type: 'object',
					properties: {
						zwei: {
							alias: 'foo.zwei',
							type: 'boolean'
						},
						drei: {
							alias: 'foo.drei',
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
				from: 'eins',
				type: 'number',
				sample: 1
			},
			{
				from: 'foo[]zwei',
				type: 'boolean',
				sample: true
			},
			{
				from: 'foo[]drei',
				type: 'string',
				sample: 'hello'
			}
		]);

		expect( translate(info) ).toEqual({
			type: 'object',
			properties: {
				eins: {
					alias: 'eins',
					type: 'number'
				},
				foo: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							zwei: {
								alias: 'foo[]zwei',
								type: 'boolean'
							},
							drei: {
								alias: 'foo[]drei',
								type: 'string'
							}
						}
					}
				}
			}
		});
	});
});
