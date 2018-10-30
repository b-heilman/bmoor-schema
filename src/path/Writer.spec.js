
const Path = require('../Path.js').default;
const Writer = require('./Writer.js').default;

describe('path/Writer.js', function(){
	describe('simple path', function(){
		it('should #generateOn correctly', function(){
			let path = new Path('foo.bar');
			let accessors = path.tokenizer.getAccessors();
			let writer = new Writer(accessors.shift());

			writer.addChild(accessors, function(){
				return 'hello world';
			});

			let target = {};

			writer.generateOn(target);

			expect(target).toEqual({
				foo: {
					bar: 'hello world'
				}
			});
		});
	});

	describe('single array paths', function(){
		it('should #generateOn correctly', function(){
			let path = new Path('foo[].bar1');
			let accessors = path.tokenizer.getAccessors();
			let writer = new Writer(accessors.shift());

			writer.addChild(accessors, function(){
				return 'hello world';
			});

			writer.addPath(new Path('foo[].bar2'), function(){
				return 'zwei';
			});

			writer.addPath(new Path('foo[].bar3'), function(){
				return 'drei';
			});

			let target = {};

			writer.generateOn(target);

			expect(target).toEqual({
				foo: [{
					bar1: 'hello world',
					bar2: 'zwei',
					bar3: 'drei'
				}]
			});
		});

		it('should #generateOn allow configuration of array', function(){
			let path = new Path('foo[]');
			let accessors = path.tokenizer.getAccessors();
			let writer = new Writer(accessors.shift());

			writer.addChild(accessors, function(){
				return [{},{}];
			});

			writer.addPath(new Path('foo[].bar1'), function(){
				return 'eins';
			});

			writer.addPath(new Path('foo[].bar2'), function(){
				return 'zwei';
			});

			writer.addPath(new Path('foo[].bar3'), function(){
				return 'drei';
			});

			let target = {};

			writer.generateOn(target);

			expect(target).toEqual({
				foo: [{
					bar1: 'eins',
					bar2: 'zwei',
					bar3: 'drei'
				},{
					bar1: 'eins',
					bar2: 'zwei',
					bar3: 'drei'
				}]
			});
		});
	});

	describe('multi array paths', function(){
		it('should #generateOn correctly', function(){
			let path = new Path('foo[].bar1');
			let accessors = path.tokenizer.getAccessors();
			let writer = new Writer(accessors.shift());

			writer.addChild(accessors, function(){
				return 'hello world';
			});

			writer.addPath(new Path('foo[].bar[].eins'), function(){
				return 'eins';
			});

			writer.addPath(new Path('foo[].bar[].zwei'), function(){
				return 'zwei';
			});

			let target = {};

			writer.generateOn(target);

			expect(target).toEqual({
				foo: [{
					bar1: 'hello world',
					bar: [{
						eins: 'eins',
						zwei: 'zwei'
					}]
				}]
			});
		});
	});
});
