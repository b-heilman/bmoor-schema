
const makeSetter = require('bmoor').makeSetter;

class Writer{
	constructor(accessor){
		this.accessor = accessor;

		this.set = makeSetter(accessor);
	}

	_makeChild(accessor){
		return new (this.constructor)(accessor);
	}

	addChild(accessors, generator){
		if (accessors.length){
			let next = accessors.shift();

			if (!this.children){
				this.children = {};

				if(!this.generator){
					this.setGenerator(() => [{}]);
				}
			}

			let value = next.join('.');
			let child = this.children[value];

			if (!child){
				child = this.children[value] = this._makeChild(next);
			}

			child.addChild(accessors, generator);
		} else {
			this.setGenerator(generator);	
		}
	}

	addPath(path, generator){
		let accessors = path.tokenizer.getAccessors();

		// TODO : better way to do this right?
		if (accessors[0].join('.') !== this.accessor.join('.')){
			throw new Error(
				'can not add path that does not '+
				'have matching first accessor'
			);
		}

		accessors.shift();

		this.addChild(accessors, generator);
	}

	setGenerator(fn){
		this.generator = fn;
	}

	generateOn(obj){
		let val = this.generator();

		this.set(obj, val);

		if (this.children){
			val.forEach(datum => {
				for(let p in this.children){
					let child = this.children[p];		
				
					child.generateOn(datum);
				}
			});
		}
	}
}

module.exports = {
	default: Writer
};
