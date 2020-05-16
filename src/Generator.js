
const bmoor = require('bmoor');
const Path = require('./Path.js').default;
const Writer = require('./path/Writer.js').default;

class Generator {

	constructor(config, manager, context){
		this.writers = {};
		this.context = context;
		this.manager = manager;

		config.forEach(cfg => {
			this.addField(
				new Path(cfg.path),
				cfg.generator,
				cfg.settings
			);
		});
	}

	addField(path, generator, options){
		if (bmoor.isString(generator)){
			const fn = this.manager.get(generator)(options);
			generator = () => fn(this.context);
		}

		const accessors = path.tokenizer.getAccessList().trim();
		
		let writer = new Writer(accessors.getFront());
		path = writer.accessor.ref;

		let found = this.writers[path];

		if (found) {
			writer = found;
		} else {
			this.writers[path] = writer; 
		}

		const following = accessors.getFollowing();

		if (following){
			writer.addChild(following, generator);
		} else {
			writer.setGenerator(generator);
		}
		

		return writer;
	}

	generate(){
		let rtn = {};

		for(let f in this.writers){
			let writer = this.writers[f];

			writer.go(rtn);
		}

		return rtn;
	}
}

module.exports = {
	Generator,
	default: Generator
};
