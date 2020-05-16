
const {expect} = require('chai');

const Generator = require('./generator.js').default;

describe('src/generator.js', function(){
	describe('with manager/common.js', function(){

	});

	describe('with manager/legacy.js', function(){
		const {manager} = require('./manager/legacy.js')
		const context = null;

		it('should #generate with custom methods', function(){
			let generator = new Generator([
				{
					path: 'eins',
					generator: function(){
						return 'one';
					}
				},
				{
					path: 'foo.bar',
					generator: function(){
						return 'fooBar';
					}
				},
				{
					path: 'hello[].world1',
					generator: function(){
						return 'eins';
					}
				},
				{
					path: 'hello[].world2',
					generator: function(){
						return 'zwei';
					}
				}
			], manager);

			expect(generator.generate()).to.deep.equal({
				eins: 'one',
				foo: {
					bar: 'fooBar'
				},
				hello: [{
					world1: 'eins',
					world2: 'zwei'
				}]
			});
		});

		it('should #generate with custom methods', function(){
			let generator = new Generator([
				{
					path: 'eins',
					generator: 'number.index'
				},
				{
					path: 'foo.bar',
					generator: 'string.random'
				},
				{
					path: 'hello[].world1',
					generator: 'boolean.random'
				},
				{
					path: 'hello[].world2',
					generator: 'number.random'
				},
				{
					path: 'constant',
					generator: 'constant',
					options: {
						value: 'constant'
					}
				}
			], manager);

			let generated = generator.generate();

			expect(generated.eins).to.exist;
			expect(generated.foo.bar).to.exist;
			expect(generated.hello[0].world1).to.exist;
			expect(generated.hello[0].world2).to.exist;
			expect(generated.constant).to.equal('constant');
		});

		it('should #generate arrays', function(){
			let generator = new Generator([
				{
					path: 'hello[].world1',
					generator: 'boolean.random'
				},
				{
					path: 'hello[].world2',
					generator: 'number.random'
				},
				{
					path: 'hello[]',
					generator: 'array',
					options: {
						length: 3
					}
				}
			], manager);

			let generated = generator.generate();

			expect(generated.hello.length).to.equal(3);
			
			expect(generated.hello[0].world1).to.exist;
			expect(generated.hello[0].world2).to.exist;
			expect(generated.hello[1].world1).to.exist;
			expect(generated.hello[1].world2).to.exist;
			expect(generated.hello[2].world1).to.exist;
			expect(generated.hello[2].world2).to.exist;
		});
	});
});