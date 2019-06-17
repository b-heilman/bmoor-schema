
const makeGetter = require('bmoor').makeGetter;

const Path = require('../Path.js').default;
const AccessList = require('./AccessList.js').default;

class Action{
	constructor(accessor){
		if (accessor instanceof Path){
			accessor = accessor.tokenizer.getAccessList();
		}

		if (accessor instanceof AccessList){
			accessor = accessor.getFront();
		}

		this.get = makeGetter(accessor.access.path);
		this.action = null;
		this.accessor = accessor;
		this.children = {};
	}

	_makeChild(accessor){
		return new (this.constructor)(accessor);
	}

	setAction(action){
		this.action = action;
	}

	addChild(accessList, action){
		let front = accessList.getFront();
		let following = accessList.getFollowing();

		let path = front.ref;
		let child = this.children[path];

		if (!child){
			child = this._makeChild(front);
			this.children[path] = child;
		}

		if (following){
			const rtn = child.addChild(following, action);

			rtn.unshift(this);

			return rtn;
		} else {
			if (action){
				child.setAction(action);
			}

			return [this, child];
		}
	}

	addPath(path, action){
		if (!(path instanceof Path)){
			path = new Path(path);
		}

		const accessList = path.tokenizer.getAccessList();

		if (accessList.getFront().ref !== this.accessor.ref){
			throw new Error(
				'can not add path that does not '+
				'have matching first accessor'
			);
		}

		const following = accessList.getFollowing();

		if (following){
			return this.addChild(following, action);
		} else {
			this.setAction(action);

			return [this];
		}
		
	}
}

module.exports = {
	Action,
	default: Action
};
