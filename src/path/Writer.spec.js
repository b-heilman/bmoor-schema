
const Path = require('../Path.js').default;
const Writer = require('./Writer.js').default;

describe('path/Writer.js', function(){
	describe('simple path', function(){
		it('should #go correctly', function(){
			let path = new Path('foo.bar');
			let accessors = path.tokenizer.getAccessList();
			let writer = new Writer(accessors.getFront());

			writer.setAction(function(){
				return 'hello world';
			});

			let target = {};

			writer.go(target);

			expect(target).toEqual({
				foo: {
					bar: 'hello world'
				}
			});
		});
	});

	describe('single array paths', function(){
		it('should #go correctly', function(){
			let path = new Path('foo[].bar1');
			let accessors = path.tokenizer.getAccessList();
			let writer = new Writer(accessors.getFront());

			writer.addChild(accessors.getFollowing(), function(){
				return 'hello world';
			});

			writer.addPath(new Path('foo[].bar2'), function(){
				return 'zwei';
			});

			writer.addPath(new Path('foo[].bar3'), function(){
				return 'drei';
			});

			let target = {};

			writer.go(target);

			expect(target).toEqual({
				foo: [{
					bar1: 'hello world',
					bar2: 'zwei',
					bar3: 'drei'
				}]
			});
		});

		it('should #go allow configuration of array', function(){
			let path = new Path('foo[]');
			let accessors = path.tokenizer.getAccessList();
			let writer = new Writer(accessors.getFront());

			writer.setGenerator(function(){
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

			writer.go(target);

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
		it('should #go correctly', function(){
			let path = new Path('foo[].bar1');
			let accessors = path.tokenizer.getAccessList();
			let writer = new Writer(accessors.getFront());

			writer.addChild(accessors.getFollowing(), function(){
				return 'hello world';
			});

			writer.addPath(new Path('foo[].bar[].eins'), function(){
				return 'eins';
			});

			writer.addPath(new Path('foo[].bar[].zwei'), function(){
				return 'zwei';
			});

			let target = {};

			writer.go(target);

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

	describe('multi array paths', function(){
		it('should #go correctly', function(){
			let path = new Path('foo[].bar1');
			let accessors = path.tokenizer.getAccessList();
			let writer = new Writer(accessors.getFront());

			writer.addChild(accessors.getFollowing(), function(){
				return 'hello world';
			});

			writer.addPath(new Path('foo[].bar[].eins'), function(){
				return 'eins';
			});

			writer.addPath(new Path('foo[].bar[].zwei'), function(){
				return 'zwei';
			});

			let target = {};

			writer.go(target);

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

	describe('with actions', function(){
		it('should #go correctly', function(){
			let path = new Path('foo[].bar1');
			let accessors = path.tokenizer.getAccessList();
			let writer = new Writer(accessors.getFront());

			writer.addChild(accessors.getFollowing(), function(){
				return 'hello world';
			});

			writer.addPath(new Path('foo[]#sub.bar[].eins'), function(){
				return 'eins';
			});

			writer.addPath(new Path('foo[]#sub.bar[].zwei'), function(){
				return 'zwei';
			});

			const target = {};
			const classes = {};

			writer.go(target, {
				runAction(action, parent){
					let cls = classes[action];
					let rtn = null;
					
					if (!cls){
						cls = [];
						classes[action] = cls;
					}

					rtn = {
						parent
					};

					cls.push(rtn);

					return rtn;
				}
			});

			expect(target).toEqual({
				foo: [{
					bar1: 'hello world'
				}]
			});

			expect(classes).toEqual({
				sub: [{
					parent: {
						bar1: 'hello world'
					},
					bar: [{
						eins: 'eins',
						zwei: 'zwei'
					}]
				}]
			});
		});
	});
});
