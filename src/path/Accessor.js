
class Accessor {
	constructor(access){
		this.ref = (access.action ? access.action+'#' : '') + 
			(access.path ? access.path.join('.') : '');
		this.access = access;
	}
}

module.exports = {
	Accessor,
	default: Accessor
};
