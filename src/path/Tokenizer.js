
function nextToken( path ){
    var i = 0,
        c = path.length,
        char = path.charAt(0),
        more = true;

    let access = null;

    if ( path.charAt(1) === ']' ){
        // don't do anything
    }else if ( char === '[' ){
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

        access = path.substring(2,i-2);
    }else{
        do {
            if ( char === '.' || char === '[' ){
                more = false;
            } else {
                i++;
                char = path.charAt(i);
            }
        } while( more && i < c );

        access = path.substring(0,i);
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
        isArray: isArray,
        accessor: access
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

    accessors(){
        var rtn = [],
            cur = null;

        for (let i = 0, c = this.tokens.length; i < c; i++){
            let token = this.tokens[i];

            if (cur){
                cur.push(token.accessor);
            }else if (token.accessor){
                cur = [token.accessor];
            }else{
                cur = [];
            }

            if (token.isArray){
                rtn.push(cur);
                cur = null;
            }
        }

        if (cur){
            rtn.push(cur);
        }

        return rtn;
    }

    chunk(){
        var rtn = [],
            cur = null;

        for (let i = 0, c = this.tokens.length; i < c; i++){
            let token = this.tokens[i];

            if (cur){
                if ( token.value.charAt(0) === '[' ){
                    cur += token.value;
                }else{
                    cur += '.'+token.value;
                }
            }else{
                cur = token.value;
            }

            if (token.isArray){
                rtn.push(cur);
                cur = null;
            }
        }

        if (cur){
            rtn.push(cur);
        }

        return rtn;
    }
}

module.exports = {
	default: Tokenizer
};

