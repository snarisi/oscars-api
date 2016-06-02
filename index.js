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
	const budget = result.budget ? parsers.parseBudget(result.budget) : null;
	console.log('parsed budget: ', budget);
};

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
			console.log('-------------------------\n');
		})
		// const noTitle = results.filter(result => !result.title);
		// const noYear = results.filter(result => !result.year);
		// const noBudget = results.filter(result => !result.budget);
		//
		// console.log('No Title: ', noTitle);
		// console.log('No Year: ', noYear);
		// console.log('No Budget: ', noBudget);
	})
	.catch(err => console.log(err));
