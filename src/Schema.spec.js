describe('bmoor-schema::Schema', function(){
	var Schema = bmoorSchema.Schema;

	it('should have been defined', function(){
		expect( Schema ).toBeDefined();
	});

	it('should parse a basic object correctly', function(){
		var schema = new Schema({
				eins: 1,
				zwei: true,
				drei: 'hello'
			});

		expect( schema.info ).toEqual([
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

		expect( schema.toJsonSchema() ).toEqual({
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
	});

	it('should parse an array correctly', function(){
		var schema = new Schema([
				'hello',
				'world'
			]);

		expect( schema.info ).toEqual([
			{
				path: '[]',
				type: 'string',
				sample: 'hello'
			}
		]);

		expect( schema.toJsonSchema() ).toEqual({
			type: 'array',
			items: {
				alias: '[]',
				type: 'string'
			}
		});
	});

	it('should parse a multi level object correctly', function(){
		var schema = new Schema({
				eins: 1,
				foo: {
					zwei: true,
					drei: 'hello'
				}
			});

		expect( schema.info ).toEqual([
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

		expect( schema.toJsonSchema() ).toEqual({
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

	it('should parse an array inside an object correctly', function(){
		var schema = new Schema({
				eins: 1,
				foo: [{
					zwei: true,
					drei: 'hello'
				}]
			});

		expect( schema.info ).toEqual([
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

		expect( schema.toJsonSchema() ).toEqual({
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
								alias: 'foo[].zwei',
								type: 'boolean'
							},
							drei: {
								alias: 'foo[].drei',
								type: 'string'
							}
						}
					}
				}
			}
		});
	});
});
