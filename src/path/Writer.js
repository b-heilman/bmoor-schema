
const bmoor = require('bmoor');
const makeSetter = bmoor.makeSetter;

const Path = require('../Path.js').default;
const Actionable = require('./Actionable.js').default;

class Writer extends Actionable {
	constructor(accessor){
		super(accessor);

		this.set = makeSetter(this.accessor.access.path);

		this.setGenerator(() => [{}]);
	}

	setAction(action){
		this.setGenerator(action);
	}

	setGenerator(fn){
		this.generator = fn;
	}

	go(to, ctx = {}){
		const action = this.accessor.access.action;
		const res = action ? ctx.runAction(action, to) : this.generator(ctx);
		
		if (bmoor.isArray(res)){
			res.forEach(datum => {
				for(let p in this.children){
					let child = this.children[p];
				
					child.go(datum, ctx);
				}
			});
		} else {
			for(let p in this.children){
				let child = this.children[p];
			
				child.go(res, ctx);
			}
		}

		if (this.set){
			this.set(to, res);

			return to;
		} else {
			return res;
		}
	}
}

function listFactory(pathStr){
	const path = new Path(pathStr);
	const accessorList = path.tokenizer.getAccessList();
	const writer = new Writer(accessorList.getFront());

	return writer.getList(accessorList.getFollowing());
}


module.exports = {
	Writer,
	listFactory,
	default: Writer
};
