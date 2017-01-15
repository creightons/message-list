var Record = require('../models/record');

// Log errors and send an error response to the user
function handleError(err, res) {
	
	console.log('Error:', err.stack);
	res.status(409).end();
}

// POST handler for creating a new record
function create(req, res) {
	var email = req.params.email,
		newRecord = Record({ email });
	
	newRecord.saveAsync().then( () => {
		res.status(200).end();
	}).catch(
		err => handleError(err, res)
	);
}

// PUT
function suspend(req, res) {
	var email = req.params.email;
	
	Record.findOneAsync({ email}).then(record => {
		record.suspend();
		return record.saveAsync();
	}).then(() => {
		res.status(200).end();
	}).catch(
		err => handleError(err, res)
	);
}

// PUT
function reactivate(req, res) {
	var email = req.params.email;
	
	Record.findOneAsync({ email }).then(record => {
		record.reactivate();
		return record.saveAsync();
	}).then(() => {
		res.status(200).end();
	}).catch(
		err => handleError(err, res)
	);
}

// DELETE
function cancel(req, res) {
	var email = req.params.email;
	
	Record.findOneAsync({ email }).then(record => {
		return record.removeAsync();
	}).then(() => {
		res.status(200).end();
	}).catch(
		err => handleError(err, res)
	);
}

module.exports = {
	create,
	reactivate,
	suspend,
	cancel,
};