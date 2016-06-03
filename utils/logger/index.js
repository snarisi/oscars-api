'use strict';

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../../logs/logfile');

module.exports = function (options) {
	const timestamp = new Date();
	const string = `${timestamp}:\n${options.message}:\n${options.data}\n\n`;

	try {
		fs.statSync(LOG_FILE);
	} catch (e) {
		fs.writeFileSync(LOG_FILE, '');
	}
	fs.appendFileSync(LOG_FILE, string);
};
