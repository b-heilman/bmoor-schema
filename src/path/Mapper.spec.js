
const Path = require('../Path.js').default;
const {'default': Reader, listFactory: readerFactory}  = require('./Reader.js');
const {'default': Writer, listFactory: writerFactory} = require('./Writer.js');
const Mapper = require('./Mapper.js').default;

describe('path/Mapper.js', function(){
	describe('simple copy', function(){
		it('should #go correctly via #addPath', function(){
			let mapper = new Mapper();
			let fromPath = new Path('foo.bar');
			let reader = new Reader(fromPath.tokenizer.getAccessList().getFront());
			let toPath = new Path('hello.world');
			let writer = new Writer(toPath.tokenizer.getAccessList().getFront());

			mapper.addPairing(
				reader.addPath('foo.bar'),
				writer.addPath('hello.world')
			);

			const from = {
				foo: {
					bar: '123'
				}
			};
			const to = {};

			mapper.go(from, to)
			.then(() => {
				expect(to).toEqual({
					hello: {
						world: '123'
					}
				});
			});
		});

		it('should #go correctly via #factory', function(done){
			let mapper = new Mapper();

			mapper.addPairing(
				readerFactory('foo.bar'),
				writerFactory('hello.world')
			);

			const from = {
				foo: {
					bar: '123'
				}
			};
			const to = {};

			mapper.go(from, to)
			.then(() => {
				expect(to).toEqual({
					hello: {
						world: '123'
					}
				});

				done();
			});
		});
	});

	describe('array copy', function(){
		it('should #go correctly', function(done){
			let mapper = new Mapper();
			let fromPath = new Path('foo[].bar');
			let reader = new Reader(fromPath.tokenizer.getAccessList().getFront());
			let toPath = new Path('hello[].world');
			let writer = new Writer(toPath.tokenizer.getAccessList().getFront());

			mapper.addPairing(
				reader.addPath('foo[].bar'),
				writer.addPath('hello[].world')
			);

			const from = {
				foo: [{
					bar: '123'
				}]
			};
			const to = {};

			mapper.go(from, to)
			.then(() => {
				expect(to).toEqual({
					hello: [{
						world: '123'
					}]
				});

				done();
			});
		});

		it('should #go correctly in multiples', function(done){
			let mapper = new Mapper();

			mapper.addPairing(
				readerFactory('foo[].bar'),
				writerFactory('hello[].world')
			);
			
			const from = {
				foo: [{
					bar: '123'
				},{
					bar: '456'
				}]
			};
			const to = {};

			mapper.go(from, to)
			.then(() => {
				expect(to).toEqual({
					hello: [{
						world: '123'
					}, {
						world: '456'
					}]
				});

				done();
			});
		});

		it('should #go correctly flat arrays', function(done){
			let mapper = new Mapper();

			mapper.addPairing(
				readerFactory('foo.bar[]'),
				writerFactory('hello.world[]')
			);
			
			const from = {
				foo: {
					bar: [
						'123',
						'456'
					]
				}
			};
			const to = {};

			mapper.go(from, to)
			.then(() => {
				expect(to).toEqual({
					hello: {
						world: [
							'123',
							'456'
						]
					}
				});

				done();
			});
		});
	});

	describe('multi array', function(){
		it('should #go correctly', function(done){
			const mapper = new Mapper();

			mapper.addPairing(
				readerFactory('eins[].foo[].bar'),
				writerFactory('zwei[].hello[].world.value')
			);

			const from = {
				eins: [{
					foo: [{
						bar: '123'
					}]
				}]
			};
			const to = {};

			mapper.go(from, to)
			.then(() => {
				expect(to).toEqual({
					zwei: [{
						hello: [{
							world: {
								value: '123'
							}
						}]
					}]
				});

				done();
			});
		});

		it('should #go correctly in multiples', function(done){
			const mapper = new Mapper();

			mapper.addPairing(
				readerFactory('eins[].foo[].bar'),
				writerFactory('zwei[].hello[].world.value')
			);

			const from = {
				eins: [{
					foo: [{
						bar: '123'
					},{
						bar: '456'
					}]
				}]
			};
			const to = {};

			mapper.go(from, to)
			.then(() => {
				expect(to).toEqual({
					zwei: [{
						hello: [{
							world: {
								value: '123'
							}
						}, {
							world: {
								value: '456'
							}
						}]
					}]
				});

				done();
			});
		});
	});

	describe('with actions', function(){
		it('should work with a single action', function(done){
			const mapper = new Mapper([{
				from: 'value.one',
				to: 'eins'
			},{
				from: 'value.two',
				to: 'zwei'
			},{
				from: 'hello[].one',
				to: '#foo.eins'
			},{
				from: 'hello[].two',
				to: '#foo.zwei'
			}]);

			const to = {};
			const classes = {};
			const from = {
				value: {
					one: 1,
					two: 2
				},
				hello: [{
					one: 10,
					two: 20
				}]
			};

			mapper.go(from, to, {
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
			})
			.then(() => {
				expect(to).toEqual({
					eins: 1,
					zwei: 2
				});

				expect(classes).toEqual({
					foo: [{
						parent: {
							eins: 1,
							zwei: 2
						},
						eins: 10,
						zwei: 20
					}]
				});

				done();
			});
		});

		it('should work with a multiple actions', function(done){
			const mapper = new Mapper([{
				from: 'value.one',
				to: 'eins'
			},{
				from: 'value.two',
				to: 'zwei'
			},{
				from: 'hello[].id',
				to: '#root.ref'
			},{
				from: 'hello[].world[].one',
				to: '#root.#foo.eins'
			},{
				from: 'hello[].world[].two',
				to: '#root.#foo.zwei'
			},{
				from: 'hello[].while[].one',
				to: '#root.#bar.eins'
			},{
				from: 'hello[].while[].two',
				to: '#root.#bar.zwei'
			}]);

			const to = {};
			const classes = {};
			const from = {
				value: {
					one: 1,
					two: 2
				},
				hello: [{
					id: 123,
					world:[{
						one: 10,
						two: 20
					}],
					while:[{
						one: 100,
						two: 200
					}]
				}]
			};

			mapper.go(from, to, {
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
			})
			.then(() => {
				expect(to).toEqual({
					eins: 1,
					zwei: 2
				});

				expect(classes).toEqual({
					root: [{
						parent: {
							eins: 1,
							zwei: 2
						},
						ref: 123
					}],
					foo: [{
						parent: {
							ref: 123,
							parent: {
								eins: 1,
								zwei: 2
							}
						},
						eins: 10,
						zwei: 20
					}],
					bar: [{
						parent: {
							ref: 123,
							parent: {
								eins: 1,
								zwei: 2
							}
						},
						eins: 100,
						zwei: 200
					}]
				});

				done();
			});
		});
	});
});
