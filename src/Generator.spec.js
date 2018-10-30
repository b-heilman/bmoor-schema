
const Generator = require('./Generator.js').default;

describe('Generator.js', function(){
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
		]);

		expect(generator.generate()).toEqual({
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
		]);

		let generated = generator.generate();

		expect(generated.eins).toBeDefined();
		expect(generated.foo.bar).toBeDefined();
		expect(generated.hello[0].world1).toBeDefined();
		expect(generated.hello[0].world2).toBeDefined();
		expect(generated.constant).toBe('constant');
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
		]);

		let generated = generator.generate();

		expect(generated.hello.length).toBe(3);
		expect(generated.hello[0].world1).toBeDefined();
		expect(generated.hello[0].world2).toBeDefined();
		expect(generated.hello[1].world1).toBeDefined();
		expect(generated.hello[1].world2).toBeDefined();
		expect(generated.hello[2].world1).toBeDefined();
		expect(generated.hello[2].world2).toBeDefined();
	});
});