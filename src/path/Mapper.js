
const bmoor = require('bmoor');

const Path = require('../Path.js').default;
const Reader = require('./Reader.js').default;
const Writer = require('./Writer.js').default;

function manageContent(ctx, incoming, parent, isLeaf){
	return isLeaf || !bmoor.isObject(incoming) ? incoming : 
		(ctx.makeNew ? ctx.makeNew(parent) : {});
}

function transform(reader, writer, ctx, content, parent, isLeaf){
	const readAction = reader.accessor.access.action;
	const writeAction = writer.accessor.access.action;

	return Promise.resolve(
		(readAction && ctx.readAction) ? ctx.readAction(
			readAction, parent, content,
			reader.accessor.access.params
		) : content
	).then(
		incoming => (ctx.writeAction && writeAction) ? 
		ctx.writeAction(
			writeAction, parent, incoming,
			writer.accessor.access.params
			// if the value is a leaf or scalar, just use that value
		) : manageContent(ctx, incoming, parent, isLeaf)
	);
}

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

		if (reader.hasAction || writer.hasAction){
			this.hasAction = true;
		}

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
				child: null 
			};

			writers[writer.accessor.ref] = writing;
		}

		if (readerList.length){
			if (!writing.child){
				writing.child = new Mapper();
			}

			if (writing.child.addPairing(readerList, writerList)){
				this.hasAction = true;
			}
		}

		return this.hasAction;
	}

	go(from, to, ctx){
		if (this.hasAction){
			return this.delay(from, to, ctx);
		} else {
			return Promise.resolve(this.inline(from, to, ctx));
		}
	}

	delay(from, to, ctx = {}){
		return Promise.all(Object.keys(this.mappings).map(map => {
			const mapping = this.mappings[map];
			const reader = mapping.reader;

			let read = reader.get(from);

			if (bmoor.isArray(read)){
				return Promise.all(Object.keys(mapping.writers)
				.map(writ => {
					const mapper = mapping.writers[writ];
					const writer = mapper.writer;

					return Promise.all(read.map(incoming => 
						transform(reader, writer, ctx, incoming, to, !mapper.child)
						.then(outgoing => {
							if (mapper.child){
								return mapper.child.go(incoming, outgoing, ctx)
								.then(() => outgoing);
							} else {
								return outgoing;
							}
						})
					)).then(next => {
						if (writer.set){
							const tmp = writer.get(to);

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
					const mapper = mapping.writers[writ];
					const writer = mapper.writer;
					// console.log('writer', writer);
					return transform(reader, writer, ctx, read, to, true)
					.then(outgoing => writer.set(to, outgoing));
				}));
			}
		}));
	}

	inline(from, to, ctx = {}){
		return Object.keys(this.mappings)
		.map(map => {
			const mapping = this.mappings[map];
			const reader = mapping.reader;

			let read = reader.get(from);

			if (bmoor.isArray(read)){
				return Object.keys(mapping.writers)
				.map(writ => {
					const mapper = mapping.writers[writ];
					const writer = mapper.writer;

					const next = read.map(incoming => {
						const outgoing = manageContent(
							ctx,
							incoming,
							to,
							!mapper.child
						);

						if (mapper.child){
							mapper.child.inline(incoming, outgoing, ctx);
						}

						return outgoing;
					});

					if (writer.set){
						const tmp = writer.get(to);

						if (tmp){
							return writer.set(to, tmp.concat(next));
						} else {
							return writer.set(to, next);
						}
					}
				});
			} else {
				return Object.keys(mapping.writers)
				.map(writ => {
					const mapper = mapping.writers[writ];
					const writer = mapper.writer;
					
					writer.set(
						to,
						manageContent(ctx, read, to, true)
					);
				});
			}
		});
	}
}

module.exports = {
	Mapper,
	default: Mapper
};
