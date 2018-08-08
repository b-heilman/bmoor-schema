
const Path = require('Path').default;

class Structure {
	constructor(){
		this.children = {};
		this.properties = [];
	}

	_makeChild(){
		return new (this.constructor)();
	}

	addPath(path){
		if (!(path instanceof Path)){
			path = new Path(path);
		}

		let root = path.root(true),
			remainder = path.remainder();

		if (remainder){
			let child = this.children[root];

			if (!child){
				child = this.children[root] = this._makeChild();
			}

			child.addPath(remainder);
		} else {
			this.properties.push(path);
		}
	}

	addChild(path, struct){
		var root = path.root(true),
			remainder = path.remainder(),
			child = this.children[root];

		if (remainder){
			if (!child){
				child = this.children[root] = this._makeChild();
			}

			child.addChild(remainder,struct);
		}else{
			if (child){
				struct.children = child.children;
				struct.properties = child.properties;
			}

			this.children[root] = struct;
		}
	}
}

module.exports = {
	default: Structure
};
