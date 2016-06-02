'use strict';

const expect = require('chai').expect;
const parsers = require('../utils/parsers');

describe('parser functions', function () {

	describe('parseBudget', function () {
		it('converts a string into a number', function () {
			const str = '1,433,000';
			const num = parsers.parseBudget(str);

			expect(num).to.be.a('number');
		});

		it('handles dollar signs', function () {
			const str = '$12,555,555';
			const num = parsers.parseBudget(str);

			expect(num).to.equal(12555555);
		});

		it('handles \'$US\'', function () {
			const str = '$US 300,000';
			const num = parsers.parseBudget(str);

			expect(num).to.equal(300000);
		});

		it('parses numeric comma-separated strings', function () {
			const str = '$1,433,000';
			const num = parsers.parseBudget(str);

			expect(num).to.equal(1433000);
		});

		it('parses a string with numbers and words', function () {
			const str = '$12 million';
			const num = parsers.parseBudget(str);

			expect(num).to.be.a('number');
			expect(num).to.equal(12000000);
		});

		it('convers GPB to USD', function () {
			const pound = '\u00A3';
			const str = `${pound}12 million`;
			const exchangeRate = 1.44;
			const num = parsers.parseBudget(str);

			expect(num).to.equal(Math.round(12000000 * exchangeRate));
		});

		it('handles strings with wikipedia citation artifacts', function () {
			const str = '$103 million [ 6 ] [ 7 ]';
			const num = parsers.parseBudget(str);

			expect(num).to.equal(103000000);
		});
	});

	describe('printBudget', function () {
		it('converts a number to a string', function () {
			const num = 130000;
			const str = parsers.printBudget(num);

			expect(str).to.be.a('string');
		});

		it('adds commas and dollar signs', function () {
			const num = 12500000;
			const str = parsers.printBudget(num);

			expect(str).to.equal('$12,500,000');
		});

		it('handles numbers with a number of digits divisible by 3', function () {
			const num = 333333333;
			const str = parsers.printBudget(num);

			expect(str).to.equal('$333,333,333');
		});
	});

	describe('parseYear', function () {
		it('keeps the years formatted as strings', function () {
			const year = '1999';
			const parsed = parsers.parseYear(year);

			expect(year).to.be.a('string');
		});

		it('removes whitespace from multi-year strings', function () {
			const year = '1927 / 28';
			const parsed = parsers.parseYear(year);

			expect(parsed).to.equal('1927/28');
		});

		it('removes wikipedia citation artifacts', function () {
			const year = '1985 [ 1 ]';
			const parsed = parsers.parseYear(year);

			expect(parsed).to.equal('1985');
		});
	});

	describe('parseTitle', function() {
		it('removes wikipedia citation artifacts', function () {
			const title = 'Jurassic Park [ 1 ] [j]';
			const parsed = parsers.parseTitle(title);

			expect(parsed).to.equal('Jurassic Park');
		});
	});
});
