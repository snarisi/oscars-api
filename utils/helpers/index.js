const helpers = {};

helpers.currencyTable = {
	'$': 'USD',
	'\u00A3': 'GBP'
};

helpers.powerTable = {
	'thousand': 1000,
	'million': 1000000,
	'billion': 1000000000
};

// NOTE: if this was hooked up to a server and running regularly
// I would set up a chron job that would hit an api and update
// the exchange rates on some schedule
helpers.exchangeRateTable = {
	'USD': 1,
	'GBP': 1.44
};

module.exports = helpers;
