const {expect} = require('chai');

describe('bmoor-schema::schema', function () {
	var bmoorSchema = require('../bmoor-schema.js'),
		encoding = bmoorSchema.encode,
		encode = encoding.bmoorSchema,
		translate = encoding.jsonSchema;

	it('should encode a basic object correctly', function () {
		var info = encode({
			eins: 1,
			zwei: true,
			drei: 'hello'
		});

		expect(info).to.deep.equal([
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

		expect(translate(info)).to.deep.equal({
			$schema: 'http://json-schema.org/schema#',
			type: 'object',
			required: [],
			properties: {
				eins: {
					type: ['number', 'null']
				},
				zwei: {
					type: ['boolean', 'null']
				},
				drei: {
					type: ['string', 'null']
				}
			}
		});

		info[0].path = 'test.eins';
		info[1].path = 'test.zwei';

		info[2].path = 'drei';

		expect(translate(info)).to.deep.equal({
			$schema: 'http://json-schema.org/schema#',
			type: 'object',
			required: [],
			properties: {
				test: {
					type: ['object', 'null'],
					required: [],
					properties: {
						eins: {
							type: ['number', 'null']
						},
						zwei: {
							type: ['boolean', 'null']
						}
					}
				},
				drei: {
					type: ['string', 'null']
				}
			}
		});
	});

	it('should encode a multi level object correctly', function () {
		var info = encode({
			eins: 1,
			foo: {
				zwei: true,
				drei: 'hello'
			}
		});

		expect(info).to.deep.equal([
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

		expect(translate(info)).to.deep.equal({
			$schema: 'http://json-schema.org/schema#',
			type: 'object',
			required: [],
			properties: {
				eins: {
					type: ['number', 'null']
				},
				foo: {
					type: ['object', 'null'],
					required: [],
					properties: {
						zwei: {
							type: ['boolean', 'null']
						},
						drei: {
							type: ['string', 'null']
						}
					}
				}
			}
		});
	});

	it('should encode an array inside an object correctly', function () {
		var info = encode({
			eins: 1,
			foo: [
				{
					zwei: true,
					drei: 'hello'
				}
			]
		});

		expect(info).to.deep.equal([
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

		expect(translate(info)).to.deep.equal({
			$schema: 'http://json-schema.org/schema#',
			type: 'object',
			required: [],
			properties: {
				eins: {
					type: ['number', 'null']
				},
				foo: {
					type: ['array', 'null'],
					items: {
						type: ['object', 'null'],
						required: [],
						properties: {
							zwei: {
								type: ['boolean', 'null']
							},
							drei: {
								type: ['string', 'null']
							}
						}
					}
				}
			}
		});
	});
});
