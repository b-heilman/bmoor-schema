const {expect} = require('chai');

const Path = require('../Path.js').default;
const Reader = require('./Reader.js').default;

describe('path/Reader.js', function () {
	describe('simple path', function () {
		it('should #go correctly', function () {
			let path = new Path('foo.bar');
			let accessors = path.tokenizer.getAccessList();
			let reader = new Reader(accessors.getFront());

			expect(
				reader.get({
					foo: {
						bar: '1'
					}
				})
			).to.equal('1');

			expect(
				reader.get({
					foo: {
						bar: ['1']
					}
				})
			).to.deep.equal(['1']);
		});
	});

	describe('complex path', function () {
		it('should #go correctly', function () {
			let path = new Path('foo[].bar');
			let accessors = path.tokenizer.getAccessList();
			let reader = new Reader(accessors.getFront());

			let readers = reader.addChild(accessors.getFollowing());

			expect(readers.length).to.equal(2);

			expect(
				readers[0].get({
					foo: [
						{
							bar: '1'
						}
					]
				})
			).to.deep.equal([
				{
					bar: '1'
				}
			]);

			expect(
				readers[1].get({
					bar: '1'
				})
			).to.deep.equal('1');
		});
	});
});
