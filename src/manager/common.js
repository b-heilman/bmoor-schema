
const {Manager} = require('bmoor-mockery/src/manager.js');

const manager = new Manager({
	array: require('bmoor-mocker/src/array.js'),
	boolean: require('bmoor-mocker/src/boolean.js'),
	date: require('bmoor-mocker/src/date.js'),
	enum: require('bmoor-mocker/src/enum.js'),
	number: require('bmoor-mocker/src/number.js'),
	string: require('bmoor-mocker/src/string.js'),
});

module.exports = {
	manager
};
