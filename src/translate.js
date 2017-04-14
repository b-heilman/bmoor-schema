function go( from, root, info ){
	var cur = from.shift();

	if ( cur[cur.length-1] === ']' ){
		cur = cur.substr( 0, cur.length - 2 );
	
		if ( cur === '' ){
			// don't think anything...
		}else{
			if ( !root[cur] ){
				root[cur] = {
					type: 'array'
				};
			}
			root = root[cur];
		}
		cur = 'items';
	}

	if ( from.length ){
		if ( !root[cur] ){
			root[cur] = {
				type: 'object',
				properties: {}
			};
		}
		go( from, root[cur].properties, info );
	}else{
		root[ cur ] = info;
	}
}

function split( str ){
	return str.replace(/]([^$])/g,'].$1').split('.');
}

function encode( schema ){
	var i, c,
		d,
		rtn,
		root,
		path = schema[0].to || schema[0].from;

	if ( split(path)[0] === '[]' ){
		rtn = { type: 'array' };
		root = rtn;
	}else{
		rtn = { type: 'object', properties: {} };
		root = rtn.properties;
	}

	for( i = 0, c = schema.length; i < c; i++ ){
		d = schema[i];

		path = d.to || d.from;
		go( split(path), root, 
			{
				type: d.type,
				alias: d.from
			}
		);
	}

	return rtn;
}

module.exports = encode;
