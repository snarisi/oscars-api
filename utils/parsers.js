// SOME HELPER FUNCTIONS

// checks a character against anything that could reasonably be included
// in a numeric string
function isNum(char) {
	return /[0-9]|\.|,/.test(char);
}

function isLetter(char) {
	return /[a-z]|[A-Z]/.test(char);
}

// turn the budget into a number, representing the budget
// in USD, converting other currencies accordingly
function parseBudget(str) {
	if (str === null) return null;

	let ptr = 0;

	function get() {
		return str[ptr++];
	}

	function peek() {
		return str[ptr];
	}

	function eof() {
		return peek() === undefined;
	}

	function consumeWhile(predicate) {
		let str = '';
		while (!eof() && predicate(peek())) {
			str += get();
		}
		return str;
	}

	function skipWhiteSpace() {
		consumeWhile(char => /\s/.test(char))
	}


	// need to track the currency, numeric value, and power (.e.g, thousand, million)
	let currency,
			number,
			power;

	const currencyTable = {
		'$': 'USD',
		'\u00A3': 'GBP'
	};

	const powerTable = {
		'million': 1000000,
		'thousand': 1000,
		'billion': 1000000000
	};

	function exchangeRate(currency) {
		const rates = {
			'USD': 1,
			'GBP': 1.44
		};
		return rates[currency];
	}

	// skip any characters that aren't numbers or currency symbols
	consumeWhile(char => !currencyTable[char] && !isNum(char));

	// if we're at a currency symbol, set the currency
	// and move the currency pointer. otherwise default to USD
	let char = peek();
	if (currencyTable[char]) {
		currency = currencyTable[char];
		get();
	} else {
		currency = 'USD';
	}

	// get to the first number
	consumeWhile(char => !isNum(char));

	// get the numbers
	const numString = consumeWhile(isNum).replace(',', '');
	number = parseFloat(numString, 10);

	// if there's a dash (indicating a range) ignore
	// the upper bound and go with the lower bound
	consumeWhile(char => !isLetter(char));

	// see if there's a word after the number
	const word = consumeWhile(isLetter).toLowerCase();

	power = powerTable[word] ? powerTable[word] : 1;
	number *= power;
	number = Math.round(number * exchangeRate(currency));

	// error checking
	if (isNaN(number)) {
		throw new Error('Got NaN');
	}

	return number;
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
// wiki notation artifacts (keep the multi-year )
function parseYear(str) {
	let ptr = 0;

	function get() {
		return str[ptr++];
	}

	function peek() {
		return str[ptr];
	}

	function eof() {
		return peek() === undefined;
	}

	function consumeWhile(predicate) {
		let str = '';
		while (!eof() && predicate(peek())) {
			str += get();
		}
		return str;
	}

	function skipWhiteSpace() {
		consumeWhile(char => /\s/.test(char))
	}

	let year = consumeWhile(isNum);
	skipWhiteSpace();
	if (peek() === '/') {
		year += get();
		skipWhiteSpace();
		let otherYear = consumeWhile(isNum);
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
