
function nextToken( path ){
    var i = 0,
        c = path.length,
        char = path.charAt(0),
        more = true;

    if ( char === '[' ){
        let count = 0;

        do {
            if ( char === '[' ){
                count++;
            }else if ( char === ']' ){
                count--;
            }

            i++;
            char = path.charAt(i);
        } while( count && i < c );
    }else{
        do {
            if ( char === '.' || char === '[' ){
                more = false;
            } else {
                i++;
                char = path.charAt(i);
            }
        } while( more && i < c );
    }
    

    let token = path.substring(0,i),
    	isArray = false;

    if ( char === '[' && path.charAt(i+1) === ']' ){
        token += '[]';
        i += 2;

        isArray = true;
    }

    if ( path.charAt(i) === '.' ){
        i++;
    }

    let next = path.substring(i);

    return {
        value: token,
        next: next,
        done: false,
        isArray: isArray
    };
}

class Tokenizer{
	constructor(path){
		var tokens = [];
		
		this.path = path;

		while( path ){
			let cur = nextToken(path);
			tokens.push(cur);
			path = cur.next;
		}

		this.pos = 0;
		this.tokens = tokens;
	}

	next(){
		var token = this.tokens[this.pos];

		if (token){
			this.pos++;

			return token;
		}else{
			return {
				done: true
			};
		}
	}
}

module.exports = {
	default: Tokenizer
};

