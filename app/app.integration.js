var request = require('supertest'),
	mongoose = require('mongoose'),
	config = require('../config'),
	assert = require('chai').assert,
	app = require('./app'),
	Record = require('../models/record');
	
mongoose.connect(config.TEST_DB_URL);

describe('Test Record Routes', function() {
	beforeEach(function(done) {
		Record.removeAsync().then( () => done() );
	});
	
	afterEach(function(done) {
		Record.removeAsync().then( () => done() );
	});
	
	it('should create a new email record', function(done) {
		var email = 'b@test.com',
			url = '/record/' + email;
			
		request(app)
			.post(url)
			.expect(200)
			.end(() => {
				Record.findOneAsync({ email }).then(record => {
					assert.strictEqual(record.email, email);
					done();
				});
			});
	});
	
	it('should get 409 error if trying to create an already existing email record', function(done) {
		var email = 'b@test.com',
			myRecord = Record({ email }),
			url = '/record/' + email;
		
		myRecord.saveAsync().then( () => {
			request(app)
				.post(url)
				.expect(409)
				.end(done);
		});
	});
	
	it('should suspend records properly', function(done) {
		var email = 'a@test.com',
			myRecord = Record({ email }),
			url = '/record/suspend/' + email;
		
		myRecord.saveAsync().then( () => {
			request(app)
				.put(url)
				.expect(200)
				.end(() => {
					Record.findOneAsync({ email }).then(record => {
						assert.strictEqual(record.email, email);
						assert.strictEqual(record.suspended, true);
						done();
					});
				});
		});
	});
	
	it('suspend should return a 409 status code if the record is missing', function(done) {
		var email = 'a@test.com',
			myRecord = Record({ email }),
			url = '/record/suspend/' + email;
		
		request(app)
			.put(url)
			.expect(409)
			.end(done);
	});
	
	it('should reactivate records properly', function(done) {
		var email = 'a@test.com',
			myRecord = Record({ email, suspended: true }),
			url = '/record/reactivate/' + email;

		myRecord.saveAsync().then( () => {
			request(app)
				.put(url)
				.expect(200)
				.end(() => {
					Record.findOneAsync({ email }).then(record => {
						assert.strictEqual(record.email, email);
						assert.strictEqual(record.suspended, false);
						done();
					});
				});
		});
	});
	
	it('reactivate should return a 409 status code if the record is missing', function(done) {
		var email = 'a@test.com',
			myRecord = Record({ email, suspend: true }),
			url = '/record/reactivate/' + email;
		
		request(app)
			.put(url)
			.expect(409)
			.end(done);
	});
	
	it('should delete records properly', function(done) {
		var email = 'a@test.com',
			myRecord = Record({ email }),
			url = '/record/' + email;

		myRecord.saveAsync().then( () => {
			request(app)
				.delete(url)
				.expect(200)
				.end(() => {
					Record.findOneAsync({ email }).then(record => {
						assert.strictEqual(record, null);
						done();
					});
				});
		});
	});
	
	it('delete should return a 409 status code if the record is missing', function(done) {
		var email = 'a@test.com',
			myRecord = Record({ email, suspend: true }),
			url = '/record/' + email;
		
		request(app)
			.delete(url)
			.expect(409)
			.end(done);
	});
});