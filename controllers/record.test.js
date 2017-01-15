var assert = require('chai').assert,
	Promise = require('bluebird'),
	mongoose = require('mongoose'),
	Record = require('../models/record'),
	controller = require('./record'),
	sinon = require('sinon');

	var sandbox;
describe('Record Controller', function() {
	beforeEach(function() {
		sandbox = sinon.sandbox.create();
	});
	afterEach(function() {
		sandbox.restore();
	});
	
	it('test create', function(done) {		
		var saveStub = sandbox.stub(mongoose.Model.prototype, 'saveAsync');
		saveStub.returns( Promise.resolve() );

		var email = 'tester@test.com',
			req = { params: { email } };
		
		
		var endStub = function(args) {
			sinon.assert.calledOnce(saveStub);
			done();
		}
		
		var res = {
			end: endStub,
			status: function(value) { return this; }
		};
		
		controller.create(req, res);
	});
	
	it('test reactivate', function(done) {
		var email = 'tester@test.com',
			fakeRecord = Record({ email }),
			req = { params: { email } };
			
		var findOneStub = sandbox.stub(Record, 'findOneAsync');
		findOneStub.returns( Promise.resolve( fakeRecord ) );
		
		var saveStub = sandbox.stub(mongoose.Model.prototype, 'saveAsync');
		saveStub.returns( Promise.resolve() );
		
		var reactivateSpy = sandbox.spy(fakeRecord, 'reactivate');

		var endStub = function(args) {
			sinon.assert.calledOnce(reactivateSpy);
			sinon.assert.calledOnce(saveStub);
			done();
		}
		
		var res = {
			end: endStub,
			status: function(value) { return this; },
		};
		
		controller.reactivate(req, res);
	});
	
	it('test suspend', function(done) {
		var email = 'tester@test.com',
			fakeRecord = Record({ email }),
			req = { params: { email } };
			
		var findOneStub = sandbox.stub(Record, 'findOneAsync');
		findOneStub.returns( Promise.resolve( fakeRecord ) );
		
		var saveStub = sandbox.stub(mongoose.Model.prototype, 'saveAsync');
		saveStub.returns( Promise.resolve() );
		
		var suspendSpy = sandbox.spy(fakeRecord, 'suspend');

		var endStub = function(args) {
			sinon.assert.calledOnce(suspendSpy);
			sinon.assert.calledOnce(saveStub);
			done();
		}
		
		var res = {
			end: endStub,
			status: function(value) { return this; },
		};
		
		controller.suspend(req, res);
	});

	it('test cancel', function(done) {
		var email = 'tester@test.com',
			fakeRecord = Record({ email }),
			req = { params: { email } };
			
		var findOneStub = sandbox.stub(Record, 'findOneAsync');
		findOneStub.returns( Promise.resolve( fakeRecord ) );
		
		var removeAsyncStub = sandbox.stub(mongoose.Model.prototype, 'removeAsync');
		removeAsyncStub.returns( Promise.resolve() );

		var endStub = function(args) {
			sinon.assert.calledOnce(removeAsyncStub);
			done();
		}
		
		var res = {
			end: endStub,
			status: function(value) { return this; },
		};
		
		controller.cancel(req, res);
	});
});