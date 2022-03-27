const {expect} = require('chai');

describe('bmoor-schema.encode.jsonSchema', function () {
	var encode = require('./jsonSchema.js').default;

	it('should handle brackets correctly', function () {
		var fields = [
			{
				path: 'root["foo-bar-1"]',
				type: 'string',
				sensitivity: 'none'
			},
			{
				path: 'root["foo-bar-2"]',
				type: 'string',
				sensitivity: 'required'
			},
			{
				path: 'root["foo-bar-3"].follow',
				type: 'string',
				sensitivity: 'required'
			},
			{
				path: 'arr1[]',
				type: 'string',
				sensitivity: 'none'
			},
			{
				path: 'arr2[]',
				type: 'string',
				sensitivity: 'required'
			},
			{
				path: 'boop.arr3[]',
				type: 'string',
				sensitivity: 'none'
			},
			{
				path: 'boop.arr4[]',
				type: 'string',
				sensitivity: 'required'
			},
			{
				path: 'boop.arr5[].prop',
				type: 'string',
				sensitivity: 'required'
			},
			{
				path: 'multi[][]',
				type: 'string',
				sensitivity: 'required'
			}
		];

		expect(encode(fields)).to.deep.equal({
			$schema: 'http://json-schema.org/schema#',
			type: 'object',
			required: [],
			properties: {
				root: {
					type: ['object', 'null'],
					required: ['foo-bar-2'],
					properties: {
						'foo-bar-1': {
							type: ['string', 'null']
						},
						'foo-bar-2': {
							type: ['string']
						},
						'foo-bar-3': {
							type: ['object', 'null'],
							required: ['follow'],
							properties: {
								follow: {
									type: ['string']
								}
							}
						}
					}
				},
				arr1: {
					type: ['array', 'null'],
					items: {
						type: ['string', 'null']
					}
				},
				arr2: {
					type: ['array', 'null'],
					minItems: 1,
					items: {
						type: ['string']
					}
				},
				boop: {
					type: ['object', 'null'],
					required: [],
					properties: {
						arr3: {
							type: ['array', 'null'],
							items: {
								type: ['string', 'null']
							}
						},
						arr4: {
							type: ['array', 'null'],
							minItems: 1,
							items: {
								type: ['string']
							}
						},
						arr5: {
							type: ['array', 'null'],
							minItems: 1,
							items: {
								type: ['object', 'null'],
								required: ['prop'],
								properties: {
									prop: {
										type: ['string']
									}
								}
							}
						}
					}
				},
				multi: {
					type: ['array', 'null'],
					minItems: 1,
					items: {
						type: ['array', 'null'],
						minItems: 1,
						items: {
							type: ['string']
						}
					}
				}
			}
		});
	});

	it('should parse correctly using fieldEncode.encode - mixed types', function () {
		var fields = [
			{
				path: 'assign',
				type: 'number',
				sensitivity: 'none',
				encrypted: 0,
				assign: {
					minimum: 0
				}
			},
			{
				path: 'attributes.hostname',
				type: 'string',
				sensitivity: 'none',
				encrypted: 0
			},
			{
				path: 'attributes.networkCarrier',
				type: 'string',
				sensitivity: 'none',
				encrypted: 0
			},
			{
				path: 'attributes.authenticationStatus',
				type: 'int',
				sensitivity: 'none',
				encrypted: 0
			},
			{
				path: 'attributes.countryCode[]',
				type: 'string',
				sensitivity: 'none',
				encrypted: 0
			},
			{
				path: 'attributes.serviceProviderPartnerId',
				type: 'string',
				sensitivity: 'none',
				encrypted: 0
			},
			{
				path: 'attributes.EVENT_TYPE',
				type: 'long',
				sensitivity: 'none',
				encrypted: 0
			},
			{
				path: 'attributes.FAMILY',
				type: 'boolean',
				sensitivity: 'none',
				encrypted: 0
			},
			{
				path: 'attributes.TIMESTAMP',
				type: 'string',
				sensitivity: 'none',
				encrypted: 0
			},
			{
				path: 'attributes.customerGUID',
				type: 'string',
				sensitivity: 'none',
				encrypted: 0
			},
			{
				path: 'attributes.uuid',
				type: 'double',
				sensitivity: 'none',
				encrypted: 1
			}
		];

		expect(encode(fields)).to.deep.equal({
			$schema: 'http://json-schema.org/schema#',
			type: 'object',
			required: [],
			properties: {
				assign: {
					type: ['number', 'null'],
					minimum: 0
				},
				attributes: {
					type: ['object', 'null'],
					required: [],
					properties: {
						hostname: {
							type: ['string', 'null']
						},
						networkCarrier: {
							type: ['string', 'null']
						},
						authenticationStatus: {
							type: ['int', 'null']
						},
						countryCode: {
							type: ['array', 'null'],
							items: {
								type: ['string', 'null']
							}
						},
						serviceProviderPartnerId: {
							type: ['string', 'null']
						},
						EVENT_TYPE: {
							type: ['long', 'null']
						},
						FAMILY: {
							type: ['boolean', 'null']
						},
						TIMESTAMP: {
							type: ['string', 'null']
						},
						customerGUID: {
							type: ['string', 'null']
						},
						uuid: {
							type: ['double', 'null'],
							encrypted: true
						}
					}
				}
			}
		});
	});
});
