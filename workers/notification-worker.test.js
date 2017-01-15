var rewire = require('rewire'),
	notificationWorker = rewire('./notification-worker'),
	sinon = require('sinon'),
	assert = require('chai').assert,
	Promise = require('bluebird'),
	Record = require('../models/record'),
	mongoose = require('mongoose'),
	assert = require('assert'),
	sandbox;
	
describe('test notificationWorker', function() {
	beforeEach(function() {
		sandbox = sinon.sandbox.create();
	});
	
	afterEach(function() {
		sandbox.restore();
	});
	
	it('should try to send emails for each record it processes', function(done) {
		var record1 = Record({ email: 'a@test.com' }),
			record2 = Record({ email: 'b@test.com' }),
			record3 = Record({ email: 'c@test.com' }),
			findStub = sandbox.stub(Record, 'findAsync'),
			incrementSpy = sandbox.spy(Record.prototype, 'incrementRecord'),
			saveStub = sandbox.stub(mongoose.Model.prototype, 'saveAsync'),
			rewiredSendEmailRevert,
			processNotifications,
			emailSinonStub = sandbox.stub();
		
		emailSinonStub.returns( Promise.resolve() );
		
		processNotifications = notificationWorker.__get__(
			'processNotifications'
		);
		
		rewiredSendEmailRevert = notificationWorker.__set__(
			'sendEmail',
			emailSinonStub
		);
		
		findStub.returns( Promise.resolve([ record1, record2, record3 ]) );
		saveStub.returns( Promise.resolve() );
		
		processNotifications().then( () => {
			sinon.assert.calledThrice(saveStub);
			sinon.assert.calledThrice(emailSinonStub);
			sinon.assert.calledThrice(incrementSpy);
			rewiredSendEmailRevert();
			done();
		});
	});
	
	it('should send emails with the correct data', function(done) {
		var sendEmail = notificationWorker.__get__('sendEmail'),
			configStub = { GMAIL_USER: 'me@gmail.com' },
			myRecord = Record({ email: 'test@test.com' });
			
		myRecord.incrementRecord();
		var sendMailStub = function(options, callback) {
			assert.deepEqual(options, {
				from: 'me@gmail.com',
				to: 'test@test.com',
				subject: 'Message #1',
				text: "This is the first message. You're awesome.",
				html: "<div>This is the first message. You're awesome.</div>"
			});
			done();
		};
			
		var transportStub = { sendMail: sendMailStub },
			transportRevert = notificationWorker.__set__({
				transporter: transportStub,
				config: configStub,
			});
		
		sendEmail(myRecord);
	});
});