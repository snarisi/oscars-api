const Parser = require('./parser.class');
const BudgetParser = require('./budgetParser.class');
const currencyTable = require('../helpers').currencyTable;
const powerTable = require('../helpers').powerTable;
const exchangeRateTable = require('../helpers').exchangeRateTable;

// turn the budget into a number, representing the budget
// in USD, converting other currencies accordingly
function parseBudget(str) {
	if (str === null) return null;

	const parser = new BudgetParser(str);

	let currencyRate,
			number,
			power,
			final;

	currencyRate = parser.getCurrencyRate();
	number = parser.getNumber();
	power = parser.getPower();

	final = Math.round(number * power * currencyRate);

	// error checking
	if (isNaN(final)) {
		throw new Error('Got NaN');
	}

	return final;
}

// prints the budget in a readable, consistent format
function printBudget(num) {
	if (num === null) {
		return null;
	}
	let str = num.toString();
	let newStr = '';
	let last = str.length - 1;

	for (let i = last; i >= 0; i--) {
		if (i < last && (last - i) % 3 === 0) {
			newStr = ',' + newStr;
		}
		newStr = str[i] + newStr;
	}
	return '$' + newStr;
}

// for the year just take out white space and any weird
// wiki notation artifacts (keep them as strings and allow
// them to represent multiple years)
function parseYear(str) {
	const parser = new Parser(str);

	let year = parser.consumeWhile(parser.isNum);
	parser.skipWhiteSpace();
	if (parser.peek() === '/') {
		year += parser.get();
		parser.skipWhiteSpace();
		let otherYear = parser.consumeWhile(parser.isNum);
		year += otherYear;
	}
	return year;
}

// for the title just take out the wiki citatation artifacts (eg, [1])
function parseTitle(str) {
	return str.replace(/\s*\[.*\]\s*$/, '');
}

module.exports = {
	parseBudget: parseBudget,
	printBudget: printBudget,
	parseYear: parseYear,
	parseTitle: parseTitle
}
