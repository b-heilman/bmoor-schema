describe('bmoor-schema::Tokenizer', function(){
	var Tokenizer = bmoorSchema.path.Tokenizer;

	it('should correctly parse', function(){
		var tokens = new Tokenizer(
				'foo.bar["hello.world"].eins[][].zwei'
			);

		expect(tokens.length).toBe();
		expect(tokens.accessors()).toEqual([
			['foo','bar','hello.world','eins'],
			[],
			['zwei']
		]);
	});

	it('should correctly chunk', function(){
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
});
