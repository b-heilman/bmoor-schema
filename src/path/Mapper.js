
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
		Object.keys(this.mappings).forEach(map => {
			const mapping = this.mappings[map];

			let res = mapping.reader.get(from);

			if (bmoor.isArray(res)){
				Object.keys(mapping.writers).forEach(writ => {
					const writing = mapping.writers[writ];
					const writer = writing.writer;
					const action = writer.accessor.access.action;

					let tmp = writer.get(to);

					const next = res.map(f => {
						const t = (ctx.runAction && action) ? ctx.runAction(action, to) : {};

						writing.child.go(f, t, ctx);

						return t;
					});

					if (writer.set){
						if (tmp){
							writer.set(to, tmp.concat(next));
						} else {
							writer.set(to, next);
						}
					}
				});
			} else {
				Object.keys(mapping.writers).forEach(writ => {
					const writing = mapping.writers[writ];
					
					writing.writer.set(to, res);
				});
			}
		});
	}
}

module.exports = {
	Mapper,
	default: Mapper
};
