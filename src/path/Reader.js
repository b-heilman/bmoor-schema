
const Path = require('../Path.js').default;
const Actionable = require('./Actionable.js').default;

class Reader extends Actionable {
}

function listFactory(pathStr){
	const path = new Path(pathStr);
	const accessorList = path.tokenizer.getAccessList();
	const reader = new Reader(accessorList.getFront());

	return reader.getList(accessorList.getFollowing());
}

module.exports = {
	Reader,
	listFactory,
	default: Reader
};
