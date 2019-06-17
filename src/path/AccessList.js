
const {Accessor} = require('./Accessor.js');

class AccessList {
	constructor(accessors){
		if (accessors[0] instanceof Accessor){
			this.accessors = accessors;
		} else {
			this.accessors = accessors.map(access => new Accessor(access));
		}
	}

	getFront(){
		return this.accessors[0];
	}

	getFollowing(){
		if (this.accessors.length === 1){
			return null;
		} else {
			return new AccessList(this.accessors.slice(1));
		}
	}

	raw(){
		return this.accessors.map(accessor => accessor.access);
	}

	simplify(){
		return this.accessors.map(accessor => accessor.access.path);
	}
}

module.exports = {
	AccessList,
	default: AccessList
};
