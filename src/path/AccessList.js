
const {Accessor} = require('./Accessor.js');

class AccessList {
	constructor(accessors){
		if (accessors[0] instanceof Accessor){
			// copy it
			this.accessors = accessors.slice(0);
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

	// if this access list has a trailing leaf with a null path accessor,
	//  drop it.
	trim(){
		const accessors = this.accessors;

		return new AccessList(
			accessors.length && !accessors[accessors.length-1].ref ?
				accessors.slice(0, -1) : accessors
		);
	}
}

module.exports = {
	AccessList,
	default: AccessList
};
