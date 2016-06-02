function parseBudget(str) {
	let ptr = 0;

	function get() {
		return str[ptr++];
	}

	function peek() {
		return str[ptr];
	}

	function skipWhiteSpace() {
		while (/\s/.test(peek())) {
			get();
		}
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

	// checks a character against anything that could reasonably be included
	// in a numeric string
	function isNum(char) {
		return /[0-9]|\.|,/.test(char);
	}

	function isLetter(char) {
		return /[a-z]|[A-Z]/.test(char);
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
		console.log('rate: ', rates[currency]);
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
	number = parseInt(numString, 10);

	// if there's a dash (indicating a range) ignore
	// the upper bound and go with the lower bound
	consumeWhile(char => !isLetter(char));

	// see if there's a word after the number
	const word = consumeWhile(isLetter).toLowerCase();

	power = powerTable[word] ? powerTable[word] : 1;
	number *= power;
	number *= exchangeRate(currency);

	// error checking
	if (isNaN(number)) {
		throw new Error('Got NaN');
	}

	return number;
}

module.exports = {
	parseBudget: parseBudget
}
