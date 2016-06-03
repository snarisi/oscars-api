'use strict';

// this module returns a parser object with some useful methods

// private values and methods
let ptr = 0;

const getChar = function (str) {
	return str[ptr++];
};

const peekChar = function (str) {
	return str[ptr];
};

const eof = function (str) {
	return peekChar(str) === undefined;
};

const consumeWhile = function (str, predicate) {
	let returnString = '';
	while (!eof(str) && predicate(peekChar(str))) {
		returnString += getChar(str);
	}
	return returnString;
};

const skipWhiteSpace = function (str) {
	return consumeWhile(str, char => /\s/.test(char));
};

const isNum = function (char) {
	return /[0-9]|\.|,/.test(char);
};

const isNotNum = function (char) {
	return !isNum(char);
};

const isLetter = function (char) {
	return /[a-z]|[A-Z]/.test(char);
};

const isNotLetter = function (char) {
	return !isLetter(char);
};

const isSymbol = function (char) {
	return isNotNum(char) && isNotLetter(char) && !/\s/.test(char);
};

const isNotSymbol = function (char) {
	return !isSymbol(char);
};

const getNextNumber = function (str) {
	let numberString = '';

	consumeWhile(str, isNotNum);

	if (eof(str)) return null;

	while (isNum(peekChar(str))) {
		let char = getChar(str);
		// skip commas
		if (char !== ',') numberString += char;
	}
	return parseFloat(numberString);
};

const getNextSymbol = function (str) {
	consumeWhile(str, isNotSymbol);
	if (eof(str)) return null;
	return consumeWhile(str, isSymbol);
};

const getNextWord = function (str) {
	consumeWhile(str, isNotLetter);
	if (eof(str)) return null;
	return consumeWhile(str, isLetter);
};

// public methods
module.exports = {
	// removes wikipedia citation artifacts
	removeNoise: function (str) {
		return str.replace(/\s*\[.*\]\s*$/, '');
	},

	// returns an array of all numbers extracted from the string
	getNumbers: function (str) {
		ptr = 0;
		const numbers = [];
		while (!eof(str)) {
			let nextNum = getNextNumber(str);
			if (nextNum) numbers.push(nextNum);
		}
		return numbers;
	},

	// returns an array of anything that isn't a letter/number/space
	getSymbols: function (str) {
		ptr = 0;
		const symbols = [];
		while (!eof(str)) {
			let nextSymbol = getNextSymbol(str);
			if (nextSymbol) symbols.push(nextSymbol);
		}
		return symbols;
	},

	// returns an array of words extracted from the string
	getWords: function (str) {
		ptr = 0;
		const words = [];
		while (!eof(str)) {
			let nextWord = getNextWord(str);
			if (nextWord) words.push(nextWord);
		}
		return words;
	}
};
