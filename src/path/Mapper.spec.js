
const {expect} = require('chai');

const Path = require('../Path.js').default;
const {'default': Reader, listFactory: readerFactory}  = require('./Reader.js');
const {'default': Writer, listFactory: writerFactory} = require('./Writer.js');
const Mapper = require('./Mapper.js').default;

describe('path/Mapper.js', function(){
	describe('#go', function(){
		it('should work correctly via #addPath', function(){
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
				expect(to).to.deep.equal({
					hello: {
						world: '123'
					}
				});
			});
		});

		it('should work correctly via #factory', function(done){
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
				expect(to).to.deep.equal({
					hello: {
						world: '123'
					}
				});

				done();
			});
		});

		describe('with array', function(){
			it('should work correctly', function(done){
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
					expect(to).to.deep.equal({
						hello: [{
							world: '123'
						}]
					});

					done();
				});
			});

			it('should work correctly in multiples', function(done){
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
					expect(to).to.deep.equal({
						hello: [{
							world: '123'
						}, {
							world: '456'
						}]
					});

					done();
				});
			});

			it('should work correctly flat arrays', function(done){
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
					expect(to).to.deep.equal({
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
			it('should work correctly', function(done){
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
					expect(to).to.deep.equal({
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

			it('should work correctly in multiples', function(done){
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
					expect(to).to.deep.equal({
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
	});

	describe('#delay', function(){
		it('should work correctly via #addPath', function(){
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

			mapper.delay(from, to)
			.then(() => {
				expect(to).to.deep.equal({
					hello: {
						world: '123'
					}
				});
			});
		});

		it('should work correctly via #factory', function(done){
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

			mapper.delay(from, to)
			.then(() => {
				expect(to).to.deep.equal({
					hello: {
						world: '123'
					}
				});

				done();
			});
		});

		describe('with array', function(){
			it('should work correctly', function(done){
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

				mapper.delay(from, to)
				.then(() => {
					expect(to).to.deep.equal({
						hello: [{
							world: '123'
						}]
					});

					done();
				});
			});

			it('should work correctly in multiples', function(done){
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

				mapper.delay(from, to)
				.then(() => {
					expect(to).to.deep.equal({
						hello: [{
							world: '123'
						}, {
							world: '456'
						}]
					});

					done();
				});
			});

			it('should work correctly flat arrays', function(done){
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

				mapper.delay(from, to)
				.then(() => {
					expect(to).to.deep.equal({
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
			it('should work correctly', function(done){
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

				mapper.delay(from, to)
				.then(() => {
					expect(to).to.deep.equal({
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

			it('should work correctly in multiples', function(done){
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

				mapper.delay(from, to)
				.then(() => {
					expect(to).to.deep.equal({
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
	});

	describe('#inline', function(){
		it('should work correctly via #addPath', function(done){
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

			mapper.inline(from, to);

			expect(to).to.deep.equal({
				hello: {
					world: '123'
				}
			});

			done();
		});

		it('should work correctly via #factory', function(done){
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

			mapper.inline(from, to);
			
			expect(to).to.deep.equal({
				hello: {
					world: '123'
				}
			});

			done();
		});

		describe('with array', function(){
			it('should work correctly', function(done){
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

				mapper.inline(from, to);
				
				expect(to).to.deep.equal({
					hello: [{
						world: '123'
					}]
				});

				done();
			});

			it('should work correctly in multiples', function(done){
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

				mapper.inline(from, to);
				
				expect(to).to.deep.equal({
					hello: [{
						world: '123'
					}, {
						world: '456'
					}]
				});

				done();
			});

			it('should work correctly flat arrays', function(done){
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

				mapper.inline(from, to);
				
				expect(to).to.deep.equal({
					hello: {
						world: [
							'123',
							'456'
						]
					}
				});

				done();
			});

			it('should work correctly leaf to object', function(done){
				let mapper = new Mapper();

				mapper.addPairing(
					readerFactory('foo.bar[]'),
					writerFactory('hello[].world')
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

				mapper.inline(from, to);
				
				expect(to).to.deep.equal({
					hello: [{
						world: '123'
					}, {
						world: '456'
					}]
				});

				done();
			});
		});

		describe('multi array', function(){
			it('should work correctly', function(done){
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

				mapper.inline(from, to);
				
				expect(to).to.deep.equal({
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

			it('should work correctly in multiples', function(done){
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

				mapper.inline(from, to);
				
				expect(to).to.deep.equal({
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
				writeAction(action, parent){
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
				expect(to).to.deep.equal({
					eins: 1,
					zwei: 2
				});

				expect(classes).to.deep.equal({
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
				writeAction(action, parent){
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
				expect(to).to.deep.equal({
					eins: 1,
					zwei: 2
				});

				expect(classes).to.deep.equal({
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

		it('should work callbacks', function(done){
			const mapper = new Mapper([{
				from: 'hello[].world[]#fk{"table":"t","reference":"r","write":"w"}',
				to: '#foo.#remote.helloWorld'
			}, {
				from: 'hello[].world[]#getParentId',
				to: '#foo.#remote.id'
			}]);

			const to = {};
			const classes = {};
			const from = {
				hello: [{
					world:[
						'foo',
						'bar'
					]
				}]
			};

			let readCalled = false;
			let writeCalled = false;
			let id = 1;

			mapper.go(from, to, {
				readAction(action, parent, incoming, params){
					readCalled = true;

					if (action==='fk'){
						expect(params).to.deep.equal({table:'t', reference:'r', write:'w'});
						return Promise.resolve('fetched: '+incoming);
					} else if (action === 'getParentId'){
						return parent.$id;
					}
				}, 
				writeAction(action, parent){
					writeCalled = true;

					let cls = classes[action];
					let rtn = null;
					
					if (!cls){
						cls = [];
						classes[action] = cls;
					}

					rtn = {
						$id: id++,
						$parent: parent.$id
					};

					cls.push(rtn);

					return rtn;
				},
				makeNew(parent){
					return {
						$id: id++,
						$parent: parent.$id
					};
				}
			}).then(() => {
				expect(to).to.deep.equal({});
				expect(classes).to.deep.equal({
					'foo': [{
						$id: 1,
						$parent: undefined
					}],
					'remote': [{
						$id: 2,
						$parent: 1,
						helloWorld: 'fetched: foo',
						id: 2
					},{
						$id: 3,
						$parent: 1,
						helloWorld: 'fetched: bar',
						id: 3
					}]
				});

				done();
			}).catch(function(err){
				console.log(err.message, err);
				expect(1).to.equal(0);

				done(err);
			});
		});
	});
});
