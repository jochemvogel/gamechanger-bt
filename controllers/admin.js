const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Match = require('../models/match')

function getAdmin(req, res) {
	const dataFilePath = './data/data.json';

	if (!fs.existsSync(dataFilePath)) {
		const data = '';
		res.render('admin/index', {
			data,
		});
		return;
	}

	let rawData = fs.readFileSync(dataFilePath);

	let matches = JSON.parse(rawData);

	res.render('admin/index', {
		matches,
	});
}

function getAddMatch(req, res) {
	res.render('admin/add-match', {
		id: uuidv4()
	});
}

function postAddMatch(req, res) {
	const dataFilePath = './data/data.json';

	/* Check if file does not exists, yet */
	if (!fs.existsSync(dataFilePath)) {
		fs.appendFile(dataFilePath, '{}', () => {
			console.log('Created new file');
		});
	}

	/* Execute it after the file is created (process.nextTick & setImmediate don't do the trick) */
	setTimeout(() => {
		const dataFile = fs.readFileSync(dataFilePath);

		const data = Array.from(JSON.parse(dataFile));

		data.push(req.body);

		const whatToWrite = JSON.stringify(data, null, 2);
		fs.writeFile('./data/data.json', whatToWrite, (err) => {
			if (err) {
				throw err;
			}
			console.log('Succesfully update data.json');
		});

		res.redirect('/admin');
	}, 10);
}

function getEditMatch(req, res) {
    const matchId = req.params.id;
	Match.findById(matchId, (match) => {
		res.render('admin/edit-match', {
			match,
		});
	});
}

function postEditMatch(req, res) {
    const updatedMatch = req.body;
    let oldMatch = '';
    const matchId = req.params.id;
    // Working on this
    //
	// Match.findById(matchId, (match) => {
    //     oldMatch = match

    //     /*

    //     ==> rewrite oldMatch to updatedMatch <==

    //     */

    //     console.log(oldMatch);
    //     console.log(updatedMatch);
    //     res.redirect('/admin')
	// }
    // );

    // const allMatches = Match.getMatchesFromFilee((matches) => {
    //     return matches;
    // });

    // setTimeout(() => {
    //     console.log(allMatches);
    // }, 1000);
}

module.exports = { getAdmin, postAddMatch, getAddMatch, getEditMatch, postEditMatch };