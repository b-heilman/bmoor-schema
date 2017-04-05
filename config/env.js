var fs = require('fs'),
	name = JSON.parse(fs.readFileSync('./package.json')).name,
	config = {
		name: name.toLowerCase(),
		library: name.toLowerCase().replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }),
		distDir: 'dist/',
		demoDir: 'demo/',
		configDir: 'config/',
		jsSrc: ['src/*.js','src/**/*.js','!src/**/*.spec.js'],
		externals: {
			'bmoor': 'bmoor'
		}
	};

config.karmaConfig = config.configDir+'karma.conf.js';
config.demoConfig = config.configDir+'demo.js';
config.libraryConfig = config.configDir+'library.js';
config.jsDemo = [config.demoConfig].concat(config.jsSrc);

module.exports = config;