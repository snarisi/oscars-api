const Parser = function (str) {
	this.str = str;
	this.ptr = 0;
};

Parser.prototype.get = function () {
	return this.str[this.ptr++];
};

Parser.prototype.peek = function () {
	return this.str[this.ptr];
};

Parser.prototype.eof = function () {
	return this.peek() === undefined;
};

Parser.prototype.consumeWhile = function (predicate) {
	let str = '';
	while (!this.eof() && predicate(this.peek())) {
		str += this.get();
	}
	return str;
};

Parser.prototype.skipWhiteSpace = function () {
	return this.consumeWhile(char => /\s/.test(char));
};

Parser.prototype.isNum = function (char) {
	return /[0-9]|\.|,/.test(char);
};

Parser.prototype.isNotNum = function (char) {
	return !Parser.prototype.isNum(char);
}

Parser.prototype.isLetter = function (char) {
	return /[a-z]|[A-Z]/.test(char);
};

Parser.prototype.isNotLetter = function (char) {
	return !Parser.prototype.isLetter(char);
};

module.exports = Parser;
