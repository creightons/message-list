var Record = require('../models/record'),
	config = require('../config'),
	nodemailer = require('nodemailer'),
	moment = require('moment'),
	Promise = require('bluebird');

var user = config.GMAIL_USERNAME,
	pass = config.GMAIL_PASSWORD,
	url = `smtps://${user}%40gmail.com:${pass}@smtp.gmail.com`,
	transporter = nodemailer.createTransport(url);

function getMessage(index) {
	var message;
	
	switch(index) {
		case 1:
			message = "This is the first message. You're awesome.";
			break;
		case 2:
			message = "This is the second message. You've made it past the first step.";
			break;
		case 3:
			message = "This is the third message. Keep it up.";
			break;
		case 4:
			message = "This is the fourth message. You're nearing the halfway point.";
			break;
		case 5:
			message = "This is the fifth message. There's no stopping you now";
			break;
		case 6:
			message = "This is the sixth message. You've made great progress.";
			break;
		case 7:
			message = "This is the seventh message. The finish live is coming into view.";
			break;
		case 8:
			message = "This is the eight message. Victory is waiting for you just around the corner."
			break;
		case 9:
			message = "This is the ninth message. You're so close, it's nerve-wracking.";
			break;
		case 10:
			message = "This is the tenth message. You've done a fantastic job."
			break;
	}
	
	return message;
}

function sendEmail(record) {
 	var message = getMessage(record.currentIndex),
		html = '<div>' + message + '</div>',
		subject = 'Message #' + record.currentIndex;
	
	var mailOptions = {
		from: config.GMAIL_USER,
		to: record.email,
		subject: subject,
		text: message,
		html: html,
	};

	// Returns a Promise so that all errors can be
	// handled in processNotifications().
	return new Promise( (resolve, reject) => {
		
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) { return reject(err); }
			
			return resolve();
		});
	});
}

function processNotifications() {
	console.log('processing');
	
	var yesterday = new Date();
	yesterday.setDate( yesterday.getDate() - 1 );
	
	return Record.findAsync({
		suspended: { $ne: true },
		finished: { $ne: true },
		$or: [
			{ lastSentRecord: { $lt: yesterday } },
			// Record dates are not set until the first
			// time they are processed.
			{ lastSentRecord: null }
		],
	}).then(records => {
		var promises = [];
		records.forEach(record => {
			record.incrementRecord(new Date());
			var sendEmailPromise = sendEmail(record).then( () => {
				return record.saveAsync();
			});
			promises.push(sendEmailPromise);
		 });

		return Promise.all(promises);
	}).then( () => {
		console.log('finished');
	}).catch(err => {
		console.log(err.stack);
	});
}

var Worker = function() {
	this.interval = null;
};

Worker.prototype.start = function() {
	if (!this.interval) {
		this.interval = setInterval(
			processNotifications,
			config.WORKER_PERIOD
		);
	}
};
		
module.exports = new Worker();