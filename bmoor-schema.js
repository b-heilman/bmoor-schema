module.exports = {
	encode: require('./src/encode.js'),
	Mapper: require('./src/Mapper.js'),
	Mapping: require('./src/Mapping.js'),
	Path: require('./src/Path.js'),
	path: {
		Tokenizer: require('./src/path/Tokenizer.js').default
	},
	validate: require('./src/validate.js')
};