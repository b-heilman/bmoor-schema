describe('bmoor-schema::Tokenizer', function(){
	var Tokenizer = require('./Tokenizer.js').default;

	it('::getAccessors', function(){
		var tokens = new Tokenizer(
				'foo.bar["hello.world"].eins[][].zwei'
			);

		expect(tokens.length).toBe();
		expect(tokens.getAccessors()).toEqual([
			['foo','bar','hello.world','eins'],
			[],
			['zwei']
		]);
	});

	it('::chunk', function(){
		var tokens = new Tokenizer(
				'foo.bar["hello.world"].eins[][].zwei'
			);

		expect(tokens.length).toBe();
		expect(tokens.chunk()).toEqual([
			'foo.bar["hello.world"].eins[]',
			'[]',
			'zwei'
		]);
	});

	describe('::root', function(){
		it('should return back accessors', function(){
			var tokens = new Tokenizer(
					'foo.bar["hello.world"].eins[][].zwei'
				);

			expect( tokens.root(true) )
			.toEqual(['foo','bar','hello.world','eins']);
		});

		it('should return back simple text', function(){
			var tokens = new Tokenizer(
					'foo.bar["hello.world"].eins[][].zwei'
				);

			expect( tokens.root() )
			.toEqual('foo.bar["hello.world"].eins[]');
		});
	});

	describe('::remainder', function(){
		it('should return back remaining tokens', function(){
			var tokenized = new Tokenizer(
					'foo.bar["hello.world"].eins[][].zwei'
				);

			expect( tokenized.remainder().tokens )
			.toEqual( tokenized.tokens.slice(4) );
		});
	});
});
