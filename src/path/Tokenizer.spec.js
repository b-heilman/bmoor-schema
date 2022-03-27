const {expect} = require('chai');

describe('bmoor-schema::Tokenizer', function () {
	var Tokenizer = require('./Tokenizer.js').default;

	describe('token generation', function () {
		it('should correctly parse with no arrays', function () {
			var tokenized = new Tokenizer('foo.bar.com');

			expect(tokenized.tokens).to.deep.equal([
				{
					type: 'linear',
					value: 'foo',
					next: 'bar.com',
					accessor: 'foo'
				},
				{
					type: 'linear',
					value: 'bar',
					next: 'com',
					accessor: 'bar'
				},
				{
					type: 'linear',
					value: 'com',
					next: null,
					accessor: 'com'
				}
			]);
		});

		it('should correctly parse with bracket access', function () {
			var tokenized = new Tokenizer('foo.bar["hello.world"]');

			expect(tokenized.tokens).to.deep.equal([
				{
					type: 'linear',
					value: 'foo',
					next: 'bar["hello.world"]',
					accessor: 'foo'
				},
				{
					type: 'linear',
					value: 'bar',
					next: '["hello.world"]',
					accessor: 'bar'
				},
				{
					type: 'linear',
					value: '["hello.world"]',
					next: null,
					accessor: 'hello.world'
				}
			]);
		});

		describe('arrays', function () {
			it('should work correctly in the front', function () {
				var tokenized = new Tokenizer('[].foo.bar');

				expect(tokenized.tokens).to.deep.equal([
					{
						type: 'array',
						value: '[]',
						next: 'foo.bar',
						accessor: null
					},
					{
						type: 'linear',
						value: 'foo',
						next: 'bar',
						accessor: 'foo'
					},
					{
						type: 'linear',
						value: 'bar',
						next: null,
						accessor: 'bar'
					}
				]);
			});

			it('should work correctly in the middle', function () {
				var tokenized = new Tokenizer('foo[].bar');

				expect(tokenized.tokens).to.deep.equal([
					{
						type: 'array',
						value: 'foo[]',
						next: 'bar',
						accessor: 'foo'
					},
					{
						type: 'linear',
						value: 'bar',
						next: null,
						accessor: 'bar'
					}
				]);
			});

			it('should work correctly in the end', function () {
				var tokenized = new Tokenizer('foo.bar[]');

				expect(tokenized.tokens).to.deep.equal([
					{
						type: 'linear',
						value: 'foo',
						next: 'bar[]',
						accessor: 'foo'
					},
					{
						type: 'array',
						value: 'bar[]',
						next: null,
						accessor: 'bar'
					},
					{
						type: 'stub',
						value: null,
						accessor: null
					}
				]);
			});
		});

		it('should correctly parse with action', function () {
			var tokenized = new Tokenizer('#hello-world.foo.bar');

			expect(tokenized.tokens).to.deep.equal([
				{
					type: 'action',
					params: {},
					value: 'hello-world',
					next: 'foo.bar',
					accessor: null
				},
				{
					type: 'linear',
					value: 'foo',
					next: 'bar',
					accessor: 'foo'
				},
				{
					type: 'linear',
					value: 'bar',
					next: null,
					accessor: 'bar'
				}
			]);
		});

		it('should correctly parse with multiple actions', function () {
			var tokenized = new Tokenizer('#hello-world.foo.#ok["bar"]');

			expect(tokenized.tokens).to.deep.equal([
				{
					type: 'action',
					params: {},
					value: 'hello-world',
					next: 'foo.#ok["bar"]',
					accessor: null
				},
				{
					type: 'linear',
					value: 'foo',
					next: '#ok["bar"]',
					accessor: 'foo'
				},
				{
					type: 'action',
					params: {},
					value: 'ok',
					next: '["bar"]',
					accessor: null
				},
				{
					type: 'linear',
					value: '["bar"]',
					next: null,
					accessor: 'bar'
				}
			]);
		});

		it('should correctly parse with back-to-back actions', function () {
			var tokenized = new Tokenizer('foo.#hello.#world.bar');

			expect(tokenized.tokens).to.deep.equal([
				{
					type: 'linear',
					value: 'foo',
					next: '#hello.#world.bar',
					accessor: 'foo'
				},
				{
					type: 'action',
					params: {},
					value: 'hello',
					next: '#world.bar',
					accessor: null
				},
				{
					type: 'action',
					params: {},
					value: 'world',
					next: 'bar',
					accessor: null
				},
				{
					type: 'linear',
					value: 'bar',
					next: null,
					accessor: 'bar'
				}
			]);
		});

		it('should correctly parse with action and array', function () {
			var tokenized = new Tokenizer('#hello-world[].foo.bar');

			expect(tokenized.tokens).to.deep.equal([
				{
					type: 'action',
					params: {},
					value: 'hello-world',
					next: '[].foo.bar',
					accessor: null
				},
				{
					type: 'array',
					value: '[]',
					next: 'foo.bar',
					accessor: null
				},
				{
					type: 'linear',
					value: 'foo',
					next: 'bar',
					accessor: 'foo'
				},
				{
					type: 'linear',
					value: 'bar',
					next: null,
					accessor: 'bar'
				}
			]);
		});

		describe('::actions', function () {
			it('should work with a leading value', function () {
				var tokenized = new Tokenizer('foo.#bar');

				expect(tokenized.tokens).to.deep.equal([
					{
						type: 'linear',
						value: 'foo',
						next: '#bar',
						accessor: 'foo'
					},
					{
						type: 'action',
						params: {},
						value: 'bar',
						next: null,
						accessor: null
					}
				]);
			});

			it('should parse params', function () {
				var tokenized = new Tokenizer(
					'#hello-world{"hello":"world"}[].foo.bar'
				);

				expect(tokenized.tokens).to.deep.equal([
					{
						type: 'action',
						params: {hello: 'world'},
						value: 'hello-world',
						next: '[].foo.bar',
						accessor: null
					},
					{
						type: 'array',
						value: '[]',
						next: 'foo.bar',
						accessor: null
					},
					{
						type: 'linear',
						value: 'foo',
						next: 'bar',
						accessor: 'foo'
					},
					{
						type: 'linear',
						value: 'bar',
						next: null,
						accessor: 'bar'
					}
				]);
			});
		});

		describe('#getAccessList', function () {
			it('should correctly generate with action and array, action first', function () {
				var tokenized = new Tokenizer('#hello-world[]foo.bar');

				expect(tokenized.getAccessList().raw()).to.deep.equal([
					{
						path: null,
						action: 'hello-world',
						params: {},
						isArray: false
					},
					{
						path: [],
						action: false,
						isArray: true
					},
					{
						path: ['foo', 'bar'],
						action: false,
						isArray: false
					}
				]);
			});

			it('should correctly generate with action and array, array first', function () {
				var tokenized = new Tokenizer('foo[]#hello-world.bar');

				expect(tokenized.getAccessList().raw()).to.deep.equal([
					{
						path: ['foo'],
						action: false,
						isArray: true
					},
					{
						path: null,
						action: 'hello-world',
						params: {},
						isArray: false
					},
					{
						path: ['bar'],
						action: false,
						isArray: false
					}
				]);
			});

			it('should correctly generate with action and array, array first', function () {
				var tokenized = new Tokenizer('#foo.#bar.ok');

				expect(tokenized.getAccessList().raw()).to.deep.equal([
					{
						path: null,
						action: 'foo',
						params: {},
						isArray: false
					},
					{
						path: null,
						action: 'bar',
						params: {},
						isArray: false
					},
					{
						path: ['ok'],
						action: false,
						isArray: false
					}
				]);
			});

			describe('trailing arrays', function () {
				it('should correctly work with raw', function () {
					var tokenized = new Tokenizer('foo.bar[]');

					const debug = tokenized.getAccessList().raw();

					expect(debug).to.deep.equal([
						{
							path: ['foo', 'bar'],
							action: false,
							isArray: true
						},
						{
							path: null,
							action: false,
							isArray: false
						}
					]);
				});

				it('should correctly work with trim', function () {
					var tokenized = new Tokenizer('foo.bar[]');

					const debug = tokenized.getAccessList().trim().raw();

					expect(debug).to.deep.equal([
						{
							path: ['foo', 'bar'],
							action: false,
							isArray: true
						}
					]);
				});
			});
		});
	});

	describe('::getAccessors', function () {
		it('should return back a simplified list', function () {
			var tokenized = new Tokenizer('foo.bar["hello.world"].eins[][].zwei');

			expect(tokenized.getAccessList().simplify()).to.deep.equal([
				['foo', 'bar', 'hello.world', 'eins'],
				[],
				['zwei']
			]);
		});

		it('should return back a trimmed simplified list', function () {
			var tokenized = new Tokenizer('foo.bar["hello.world"].eins[][].zwei');

			expect(tokenized.getAccessList().trim().simplify()).to.deep.equal([
				['foo', 'bar', 'hello.world', 'eins'],
				[],
				['zwei']
			]);
		});

		it('should work with trailing arrays', function () {
			var tokenized = new Tokenizer('foo.bar["hello.world"].eins[]');

			expect(tokenized.getAccessList().simplify()).to.deep.equal([
				['foo', 'bar', 'hello.world', 'eins'],
				null
			]);
		});

		it('should work with trimming trailing arrays', function () {
			var tokenized = new Tokenizer('foo.bar["hello.world"].eins[]');

			expect(tokenized.getAccessList().trim().simplify()).to.deep.equal([
				['foo', 'bar', 'hello.world', 'eins']
			]);
		});
	});

	describe('::chunk', function () {
		it('should work with complex paths', function () {
			var tokenized = new Tokenizer('foo.bar["hello.world"].eins[][].zwei');

			expect(tokenized.chunk()).to.deep.equal([
				{
					type: 'array',
					path: 'foo.bar["hello.world"].eins[]'
				},
				{
					type: 'array',
					path: '[]'
				},
				{
					type: 'linear',
					path: 'zwei'
				}
			]);
		});

		it('should work with actions', function () {
			var tokenized = new Tokenizer('foo.bar.#helloWorld.eins[][].zwei');

			expect(tokenized.chunk()).to.deep.equal([
				{
					type: 'action',
					path: 'foo.bar#helloWorld'
				},
				{
					type: 'array',
					path: 'eins[]'
				},
				{
					type: 'array',
					path: '[]'
				},
				{
					type: 'linear',
					path: 'zwei'
				}
			]);
		});

		it('should work with multiple actions', function () {
			var tokenized = new Tokenizer('#foo.#bar.#helloWorld.com');

			expect(tokenized.chunk()).to.deep.equal([
				{
					type: 'action',
					path: 'foo'
				},
				{
					type: 'action',
					path: 'bar'
				},
				{
					type: 'action',
					path: 'helloWorld'
				},
				{
					type: 'linear',
					path: 'com'
				}
			]);
		});
	});

	describe('::root', function () {
		it('should return back accessors', function () {
			var tokenized = new Tokenizer('foo.bar["hello.world"].eins[][].zwei');

			expect(tokenized.root(true)).to.deep.equal([
				'foo',
				'bar',
				'hello.world',
				'eins'
			]);
		});

		it('should return back simple text', function () {
			var tokenized = new Tokenizer('foo.bar["hello.world"].eins[][].zwei');

			expect(tokenized.root()).to.deep.equal('foo.bar["hello.world"].eins[]');
		});
	});

	describe('::remainder', function () {
		it('should return back remaining tokenized', function () {
			var tokenized = new Tokenizer('foo.bar["hello.world"].eins[][].zwei');

			expect(tokenized.remainder().tokens).to.deep.equal(
				tokenized.tokens.slice(4)
			);
		});
	});
});
