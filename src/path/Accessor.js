
class Accessor {
	constructor(access){
		if (!access.action && !access.path){
			this.ref = null;
		} else {
			this.ref = (access.action ? access.action+'#' : '') + 
				(access.path ? access.path.join('.') : '');
		}
		
		this.access = access;
	}
}

module.exports = {
	Accessor,
	default: Accessor
};
