const {expect} = require('chai');

describe('bmoor-schema.encode.bmoorSchema', function () {
	var encode = require('./bmoorSchema.js').default;

	it('should work correctly with an object', function () {
		var encoding = encode({
			foo: 'bar',
			arr: [{first: 1}, {second: 2}],
			obj: {
				foo: true,
				'hello-world': 'hola',
				'boop doop': 'ok',
				'eins.zwei': 12,
				well_ok: 'snake'
			},
			multi: [['val', 'ue']]
		});

		expect(encoding.length).to.equal(8);

		expect(encoding[0].path).to.equal('foo');
		expect(encoding[1].path).to.equal('arr[].first');
		expect(encoding[2].path).to.equal('obj.foo');
		expect(encoding[3].path).to.equal('obj["hello-world"]');
		expect(encoding[4].path).to.equal('obj["boop doop"]');
		expect(encoding[5].path).to.equal('obj["eins.zwei"]');
		expect(encoding[6].path).to.equal('obj.well_ok');
		expect(encoding[7].path).to.equal('multi[][]');
	});

	it('should allow escaping override', function () {
		var encoding = encode(
			{
				foo: 'bar',
				arr: [{first: 1}, {second: 2}],
				obj: {
					foo: true,
					'hello-world': 'hola',
					'boop doop': 'ok',
					'eins.zwei': 12,
					well_ok: 'snake'
				},
				multi: [['val', 'ue']]
			},
			/\./
		);

		expect(encoding.length).to.equal(8);

		expect(encoding[0].path).to.equal('foo');
		expect(encoding[1].path).to.equal('arr[].first');
		expect(encoding[2].path).to.equal('obj.foo');
		expect(encoding[3].path).to.equal('obj.hello-world');
		expect(encoding[4].path).to.equal('obj.boop doop');
		expect(encoding[5].path).to.equal('obj["eins.zwei"]');
		expect(encoding[6].path).to.equal('obj.well_ok');
		expect(encoding[7].path).to.equal('multi[][]');
	});

	it('should ignore null and undefined values', function () {
		var encoding = encode({
			foo: 'bar',
			nullObj: null,
			undefinedObj: undefined
		});

		expect(encoding.length).to.equal(1);
		expect(encoding).to.deep.equal([
			{
				path: 'foo',
				type: 'string',
				sample: 'bar'
			}
		]);
	});
});
