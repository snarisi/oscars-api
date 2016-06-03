'use strict';

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../../logs/logfile');

module.exports = function (options) {
	const timestamp = new Date();
	const string = `${timestamp}:\n${options.message}:\n${options.data}\n\n`;

	fs.appendFileSync(LOG_FILE, string);
};
