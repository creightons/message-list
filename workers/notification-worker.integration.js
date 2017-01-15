var mongoose = require('mongoose'),
	Promise = require('bluebird'),
	assert = require('chai').assert,
	Record = require('../models/record'),
	sinon = require('sinon'),
	rewire = require('rewire'),
	notificationWorker = rewire('./notification-worker'),
	config = require('../config');
	
mongoose.connect(config.TEST_DB_URL);

var fakeSystemDate = '2016-11-18T12:00:00',
	timeLessThanDay = '2016-11-18T01:00:00',
	timeMoreThanDay = '2016-11-16T12:00:00';
	
var clock = sinon.useFakeTimers(new Date(fakeSystemDate).getTime() );

var records = [
	Record({ email: 'a@test.com' }),
	Record({ email: 'b@test.com' }),
	Record({ email: 'c@test.com' }),
	Record({ email: 'd@test.com' }),
];

// This record was sent with the last 24 hours. It should not be sent.
records[0].lastSentRecord = new Date(timeLessThanDay);
records[0].currentIndex = 3;
// This record was sent more than 24 hours ago. It should be updated and sent.
records[1].lastSentRecord = new Date(timeMoreThanDay);
records[1].currentIndex = 3;
// This record is suspended. It should not be sent;
records[2].lastSentRecord = new Date(timeLessThanDay);
records[2].suspended = true;
// This record is finished. It has nothing left to update.
records[3].lastSentRecord = new Date(timeLessThanDay);
records[3].finished = true;


var transporterStub = {
	// Stub this method so that no emails get sent
	sendMail: (options, callback) => {
		// Calling the callback will force sendEmail()
		// to return a promise
		return callback(null);
	},
};

var sendEmail = notificationWorker.__get__('sendEmail'),
	processNotifications = notificationWorker.__get__(
		'processNotifications'
	),
	findAsyncSpy = sinon.spy(Record, 'findAsync'),
	sendEmailSpy = sinon.spy(sendEmail);

notificationWorker.__set__({
	sendEmail: sendEmailSpy,
	transporter: transporterStub,
});


describe('procesNotifications', function() {
	before(function(done) {
		var promises = [];
		
		records.forEach(record => {
			promises.push(record.saveAsync());
		});
		
		Promise.all(promises).then( () => done() );
	});
	
	after(function(done) {
		var promises = [];
		records.forEach(record => {
			promises.push(record.removeAsync());
		});
		
		Promise.all(promises).then( () => done() );
	});
	
	it('should send emails only for the appropriate types of records', function(done) {
		processNotifications().then( () => {
			sinon.assert.calledOnce(findAsyncSpy);
			sinon.assert.calledOnce(sendEmailSpy);
			var sentRecord = sendEmailSpy.args[0][0];
			assert.strictEqual(sentRecord.email, 'b@test.com');
			done();
		});
	});
});