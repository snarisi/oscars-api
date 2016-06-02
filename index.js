const fetch = require('node-fetch');
const mainURI = 'http://oscars.yipitdata.com/';
const parsers = require('./utils/parsers');

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

// helper function to clean up the results... i.e., turn
// the budget into a number, and remove the extra info from
// the year
const cleanUp = function (result) {
	result.title = parsers.parseTitle(result.title);
	result.year = parsers.parseYear(result.year);
	result.budget = parsers.parseBudget(result.budget);
};

const average = function (arr) {
	const num = arr.length;
	const sum = arr.reduce((acc, curr) => acc + curr);

	return Math.round(sum / num);
}

// the main routine
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
	.then(results => {
		results.forEach(result => {
			cleanUp(result);

			console.log('Title: ', result.title);
			console.log('Year: ', result.year);
			console.log('Budget: ', result.budget);
			console.log('Formatted: ', parsers.printBudget(result.budget));
			console.log('-------------------------\n');

		})
		const budgets = results.map(result => result.budget);
		const averageBudget = average(budgets);
		console.log('Average among all winners: ', parsers.printBudget(averageBudget));
	})
	.catch(err => console.log(err));
