
const bmoor = require('bmoor');

const Path = require('../Path.js').default;
const Reader = require('./Reader.js').default;
const Writer = require('./Writer.js').default;

class Mapper {
	constructor(pairings = []){
		this.mappings = {};

		pairings.forEach(pairing => this.addPairing(
			pairing.from,
			pairing.to
		));
	}

	_makeChild(){
		return new (this.constructor)();
	}

	addPairing(readerList, writerList){
		if (bmoor.isString(readerList)){
			readerList = new Path(readerList);
		}

		if (readerList instanceof Path){
			let reader = new Reader(readerList);
			readerList = reader.addPath(readerList);
		}

		if (bmoor.isString(writerList)){
			writerList = new Path(writerList);
		}

		if (writerList instanceof Path){
			let writer = new Writer(writerList);
			writerList = writer.addPath(writerList);
		}

		if (readerList.length !== writerList.length){
			throw new Error(`Can not pair different amount of writer(${writerList.length}) from readers(${readerList.length})`);
		}

		const reader = readerList.shift();
		const writer = writerList.shift();

		let mapping = this.mappings[reader.accessor.ref];

		if (!mapping){
			mapping = {
				reader,
				writers: {}
			};

			this.mappings[reader.accessor.ref] = mapping;
		}

		let writers = mapping.writers;

		let writing = writers[writer.accessor.ref];

		if (!writing){
			writing = {
				writer,
				child: new Mapper()
			};

			writers[writer.accessor.ref] = writing;
		}

		if (readerList.length){
			writing.child.addPairing(readerList, writerList);
		}
	}

	go(from, to, ctx = {}){
		return Promise.all(Object.keys(this.mappings).map(map => {
			const mapping = this.mappings[map];

			let read = mapping.reader.get(from);

			if (bmoor.isArray(read)){
				return Promise.all(Object.keys(mapping.writers)
				.map(writ => {
					const mapper = mapping.writers[writ];
					const writer = mapper.writer;
					const action = writer.accessor.access.action;

					let tmp = writer.get(to);

					return Promise.all(read.map(incoming => 
						Promise.resolve(
							(ctx.runAction && action) ? 
							ctx.runAction(action, to) : (bmoor.isObject(incoming) ? {} : incoming)
						).then(outgoing => 
							Promise.resolve(mapper.child.go(incoming, outgoing, ctx))
							.then(() => outgoing)
						)
					)).then(next => {
						if (writer.set){
							if (tmp){
								return writer.set(to, tmp.concat(next));
							} else {
								return writer.set(to, next);
							}
						}
					});
				}));
			} else {
				return Promise.all(Object.keys(mapping.writers)
				.map(writ => {
					const writing = mapping.writers[writ];
					
					return writing.writer.set(to, read);
				}));
			}
		}));
	}
}

module.exports = {
	Mapper,
	default: Mapper
};
