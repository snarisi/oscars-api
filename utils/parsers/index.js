'use strict';

const parser = require('./parser.service');
const currencyTable = require('../helpers').currencyTable;
const powerTable = require('../helpers').powerTable;
const exchangeRateTable = require('../helpers').exchangeRateTable;

module.exports = {
	// turn the budget into a number, represented in
	// USD, converting other currencies accordingly
	parseBudget: function (str) {
		if (str === null) return null;

		const cleanStr = parser.removeNoise(str);
		const symbols = parser.getSymbols(cleanStr);
		const numbers = parser.getNumbers(cleanStr);
		const words = parser.getWords(cleanStr);

		let number, currency, exchangeRate, power, final;

		// in case of a range, the numbers array will have two numbers
		// i decided to just pull the lower bound into the data set,
		// but it would be easy to change this to take the higher bound,
		// the average, or keep both numbers
		number = numbers[0];

		// there's a chance the string could have other random
		// symbols in it, so i'm taking the array and using the
		// first one that matches one of the currency symbols.
		// if none do, i default to USD
		symbols.forEach(symbol => {
			if (!currency && currencyTable[symbol]) {
				currency = currencyTable[symbol];
			}
		});
		if (!currency) currency = 'USD';
		exchangeRate = exchangeRateTable[currency];

		// likewise, there may be random words aside from the number-related
		// ones, so i'm checking for a match in that array
		words.forEach(word => {
			if (!power && powerTable[word]) {
				power = powerTable[word];
			}
		});
		if (!power) power = 1;

		final = Math.floor(number * power * exchangeRate);

		// if for some reason the answer is NaN, log it and return null
		if (isNaN(final)) {
			console.log('Got NaN from budget string: ', str);
			return null;
		}

		return final;
	},

	// prints the budget in a readable, consistent format
	printBudget: function (num) {
		if (num === null) return 'Not Available';

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
	},

	// numbers here will be the year(s).  if there are two years,
	// i join them with a slash. otherwise i just remove whitespace
	// and uncecessary noise including the '(35th)' in every year.
	// i kept the result as a string because that's the easiest way
	// to handle the multi-year entries, but if it had to be a number
	// for any reason, it would be easy to change this function to convert it
	parseYear: function (str) {
		let cleanStr = parser.removeNoise(str);
		cleanStr = cleanStr.replace(/\s*\(.*\)\s*$/, '');
		const numbers = parser.getNumbers(cleanStr);

		return numbers.join('/');
	},

	// for the title just remove the noise
	parseTitle: function (str) {
		return parser.removeNoise(str);
	}
};
