var request = require('supertest'),
	mongoose = require('mongoose'),
	router = require('./record'),
	config = require('../config'),
	app = require('express')(),
	Record = require('../models/record');
	
mongoose.connect(config.TEST_DB_URL);

var myRecord = Record({ email: 'a@test.com' });
app.use('/record', router);
describe('Test Routes', function() {
	beforeEach(function(done) {
		Record.removeAsync().then(
			() => myRecord.saveAsync()
		).then( () => done() );
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
			.end(done);
	});
});