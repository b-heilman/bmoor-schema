const bmoor = require('bmoor');

const Path = require('../Path.js').default;
const Reader = require('./Reader.js').default;
const Writer = require('./Writer.js').default;

function manageContent(ctx, incoming, parent, isLeaf) {
	return isLeaf || !bmoor.isObject(incoming)
		? incoming
		: ctx.makeNew
		? ctx.makeNew(parent)
		: {};
}

function transform(reader, writer, ctx, content, parent, isLeaf) {
	const readAction = reader.accessor.access.action;
	const writeAction = writer.accessor.access.action;

	return Promise.resolve(
		readAction && ctx.readAction
			? ctx.readAction(
					readAction,
					parent,
					content,
					reader.accessor.access.params
			  )
			: content
	).then((incoming) =>
		ctx.writeAction && writeAction
			? ctx.writeAction(
					writeAction,
					parent,
					incoming,
					writer.accessor.access.params
					// if the value is a leaf or scalar, just use that value
			  )
			: manageContent(ctx, incoming, parent, isLeaf)
	);
}

class Mapper {
	constructor(pairings = []) {
		this.mappings = {};

		pairings.forEach((pairing) => this.addPairing(pairing.from, pairing.to));
	}

	_makeChild() {
		return new this.constructor();
	}

	addPairing(readerList, writerList) {
		if (bmoor.isString(readerList)) {
			readerList = new Path(readerList);
		}

		if (readerList instanceof Path) {
			let reader = new Reader(readerList);
			readerList = reader.addPath(readerList);
		}

		if (bmoor.isString(writerList)) {
			writerList = new Path(writerList);
		}

		if (writerList instanceof Path) {
			let writer = new Writer(writerList);
			writerList = writer.addPath(writerList);
		}

		if (readerList.length !== writerList.length) {
			const err = new Error(
				`Can not pair different amount of writer(${writerList.length}) from readers(${readerList.length})`
			);
			err.context = {
				reader: readerList,
				writer: writerList
			};

			throw err;
		}

		const reader = readerList.shift();
		const writer = writerList.shift();

		if (reader.hasAction || writer.hasAction) {
			this.hasAction = true;
		}

		let mapping = this.mappings[reader.accessor.ref];

		if (!mapping) {
			mapping = {
				reader,
				writers: {}
			};

			this.mappings[reader.accessor.ref] = mapping;
		}

		let writers = mapping.writers;

		let writing = writers[writer.accessor.ref];

		if (!writing) {
			writing = {
				writer,
				child: null
			};

			writers[writer.accessor.ref] = writing;
		}

		if (readerList.length) {
			if (!writing.child) {
				writing.child = new Mapper();
			}

			if (writing.child.addPairing(readerList, writerList)) {
				this.hasAction = true;
			}
		}

		return this.hasAction;
	}

	go(from, to, ctx) {
		if (this.hasAction) {
			return this.delay(from, to, ctx);
		} else {
			return Promise.resolve(this.inline(from, to, ctx));
		}
	}

	delay(from, to, ctx = {}) {
		return Promise.all(
			Object.keys(this.mappings).map((map) => {
				const mapping = this.mappings[map];
				const reader = mapping.reader;

				let read = reader.get ? reader.get(from) : from;

				if (bmoor.isArray(read)) {
					return Promise.all(
						Object.keys(mapping.writers).map((writ) => {
							const mapper = mapping.writers[writ];
							const writer = mapper.writer;

							return Promise.all(
								read.map((incoming) =>
									transform(
										reader,
										writer,
										ctx,
										incoming,
										to,
										!mapper.child
									).then((outgoing) => {
										if (mapper.child) {
											return mapper.child
												.go(incoming, outgoing, ctx)
												.then(() => outgoing);
										} else {
											return outgoing;
										}
									})
								)
							).then((next) => {
								if (writer.set) {
									const tmp = writer.get(to);

									if (tmp) {
										return writer.set(to, tmp.concat(next));
									} else {
										return writer.set(to, next);
									}
								}
							});
						})
					);
				} else {
					return Promise.all(
						Object.keys(mapping.writers).map((writ) => {
							const mapper = mapping.writers[writ];
							const writer = mapper.writer;

							return transform(reader, writer, ctx, read, to, true).then(
								(outgoing) => {
									writer.set(to, outgoing);
								}
							);
						})
					);
				}
			})
		);
	}

	inline(from, to, ctx = {}) {
		let rtn = to;

		Object.keys(this.mappings).map((map) => {
			const mapping = this.mappings[map];
			const reader = mapping.reader;

			let read = reader.get ? reader.get(from) : from;

			if (bmoor.isArray(read)) {
				return Object.keys(mapping.writers).map((target) => {
					const mapper = mapping.writers[target];
					const writer = mapper.writer;

					const next = read.map((incoming) => {
						let outgoing = manageContent(ctx, incoming, to, !mapper.child);

						// TODO : how do I detect this child doesn't need to be
						//   run?  I can get rid of the if 'writer.set' below
						if (mapper.child) {
							const override = mapper.child.inline(incoming, outgoing, ctx);

							if (override) {
								outgoing = override;
							}
						}

						return outgoing;
					});

					if (writer.set) {
						const tmp = writer.get(to);

						if (tmp) {
							return writer.set(to, tmp.concat(next));
						} else {
							return writer.set(to, next);
						}
					}
				});
			} else {
				let keys = Object.keys(mapping.writers);

				if (keys.length === 1) {
					const writ = keys[0];
					const mapper = mapping.writers[writ];
					const writer = mapper.writer;

					const toWrite = manageContent(ctx, read, to, true);

					if (writer.set) {
						if (bmoor.isObject(to)) {
							writer.set(to, toWrite);
						} else {
							rtn = {};
							writer.set(rtn, toWrite);
						}
					}
				} else {
					keys.map((writ) => {
						const mapper = mapping.writers[writ];
						const writer = mapper.writer;

						if (writer.set) {
							const toWrite = manageContent(ctx, read, to, true);

							writer.set(to, toWrite);
						}
					});
				}
			}
		});

		return rtn;
	}
}

module.exports = {
	Mapper,
	default: Mapper
};
