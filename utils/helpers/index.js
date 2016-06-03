'use strict';

module.exports = {
	currencyTable: {
		'$': 'USD',
		'\u00A3': 'GBP'
	},

	powerTable: {
		'thousand': 1000,
		'million': 1000000,
		'billion': 1000000000
	},

	// TODO: I'm using today's exchange rate which doesn't make
	// much sense. The next step would be to build another API caller
	// to get the right rates from here to build the table:
  // https://en.wikipedia.org/wiki/Tables_of_historical_exchange_rates_to_the_United_States_dollar
	exchangeRateTable: {
		'USD': 1,
		'GBP': 1.44
	}
};
