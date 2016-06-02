const Parser = require('./parser.class');
const currencyTable = require('../helpers').currencyTable;
const powerTable = require('../helpers').powerTable;
const exchangeRateTable = require('../helpers').exchangeRateTable;

const BudgetParser = function (str) {
	this.str = str;
	this.ptr = 0;
};

BudgetParser.prototype = Object.create(Parser.prototype);

BudgetParser.prototype.getCurrencyRate = function () {
	// skip ahead until finding a currency symbol or number
	this.consumeWhile(char => {
		return !currencyTable[char] && this.isNotNum(char)
	});

	let char = this.peek();
	let currency;

	// if there is a currency symbol return the currency
	// and move the pointer to the next number
	if (currencyTable[char]) {
		this.consumeWhile(this.isNotNum);
		currency = currencyTable[char];

	// otherwise default to USD
	} else {
		currency = 'USD';
	}

	return exchangeRateTable[currency];
};

BudgetParser.prototype.getNumber = function () {
	this.consumeWhile(this.isNotNum);
	const numString = this.consumeWhile(this.isNum).replace(/,/g, '');

	// if there's a dash (indicating a range) ignore
	// the upper bound, use the lower bound, and skip
	// to the next word
	this.consumeWhile(this.isNotLetter);

	return parseFloat(numString, 10);
};

BudgetParser.prototype.getPower = function () {
	this.skipWhiteSpace();
	const word = this.consumeWhile(this.isLetter);
	return powerTable[word] ? powerTable[word] : 1;
};

module.exports = BudgetParser;
