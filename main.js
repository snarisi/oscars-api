'use strict';

const fetch = require('node-fetch');
const logger = require('./utils/logger');

const mainURI = 'http://oscars.yipitdata.com/';
const parsers = require('./utils/parsers');
const MAX_ATTEMPTS = 3;
const WAIT_TIME = 5000;

let attempts = 0;

// helper function to fetch the details for a single film
// and return a js object with the year, title, and budget
const getDetails = function (winnerByYear) {
	const title = winnerByYear.winner.Film;
	const year = winnerByYear.year;

	return fetch(winnerByYear.winner['Detail URL'])
		.then(res => res.json())
		.then(data => {
			const budget = data.Budget || null;
			return {
				title: title,
				year: year,
				budget: budget
			};
		});
};

// helper function to parse the results into the right format,
// i.e., turn the budget into a number, and remove the extra
// info from the year. also will add an entry to the log file
// for anything that comes back null
const parse = function (result) {
	const resultString = JSON.stringify(result, null, 2);
	const data = {};

	data.title = parsers.parseTitle(result.title);
	if (data.title === null) {
		logger({ message: 'Null value in title field', data: resultString });
	}

	data.year = parsers.parseYear(result.year);
	if (data.year === null) {
		logger({ message: 'Null value in year field', data: resultString });
	}

	data.budget = parsers.parseBudget(result.budget);
	if (data.budget === null) {
		logger({ message: 'Null value in budget field', data: resultString });
	}
	return data;
};

const average = function (arr) {
	const num = arr.length;
	const sum = arr.reduce((acc, curr) => acc + curr);

	return Math.round(sum / num);
};

// the main routine
function main() {
	attempts++;

	fetch(mainURI)
		.then(res => res.json())
		.then(body => {
			const groups = body.results;
			const winnersByYear = groups.map(group => {
				const winner = group.films.filter(film => film.Winner)[0];
				const year = group.year;
				return { year: year, winner: winner };
			});

			const promises = winnersByYear.map(getDetails);
			return Promise.all(promises);
		})
		.then(rawResults => {
			const results = rawResults.map(parse);
			results.forEach(result => {

				console.log('\n');
				console.log('    --------------------------------------------------');
				console.log('    Year:   ', result.year);
				console.log('    Winner: ', result.title);
				console.log('    Budget: ', parsers.printBudget(result.budget));
				console.log('    --------------------------------------------------');

			});

			const budgets = results.map(result => result.budget).filter(budget => budget !== null);
			const averageBudget = average(budgets);

			console.log('\n');
			console.log('    --------------------------------------------------');
			console.log('    Average among all winners: ', parsers.printBudget(averageBudget));
			console.log('    --------------------------------------------------');

		})
		.catch(err => {
			console.log('ERROR: ', err.message);
			if (attempts < MAX_ATTEMPTS) {
				console.log('\nRetrying...\n');
				setTimeout(main, WAIT_TIME);
			} else {
				console.log('\nToo many failed attempts, exiting.\n');
				process.kill(1);
			}
	});
}

main();
