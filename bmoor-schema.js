module.exports = {
	encode: require('./src/encode.js'), // is directory
	Mapper: require('./src/Mapper.js').default,
	Mapping: require('./src/Mapping.js'),
	Path: require('./src/Path.js').default,
	path: {
		Tokenizer: require('./src/path/Tokenizer.js').default
	},
	validate: require('./src/validate.js').default
};