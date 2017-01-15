var assert = require('chai').assert;
var Record = require('./record');

describe('test Record model', function() {
	it('should have initial values set', function() {
		var email = 'test@testing.com';
		var newRecord = Record({ email });
		
		assert.strictEqual(newRecord.email, email);
		assert.strictEqual(newRecord.currentIndex, 0);
		assert.strictEqual(newRecord.lastSentRecord, null);
		assert.strictEqual(newRecord.suspended, false);
		assert.strictEqual(newRecord.finished, false);
	});
	
	it('calling incrementRecord() at the max index should set the finished flag', function() {
		var email = 'test@testing.com';
		var newRecord = Record({ email });
		newRecord.currentIndex = 9;
		var sendingDate = new Date();
		
		newRecord.incrementRecord(sendingDate);
		
		assert.strictEqual(newRecord.finished, true);
		assert.strictEqual(newRecord.currentIndex, 10);
		assert.strictEqual(newRecord.lastSentRecord, sendingDate);
	});
	
	it('calling incrementRecord() increase the index and set the lastSentRecord date', function() {
		var email = 'test@testing.com';
		var newRecord = Record({ email });
		var sendingDate = new Date();
		newRecord.incrementRecord(sendingDate);
		assert.strictEqual(newRecord.currentIndex, 1);
		assert.strictEqual(newRecord.lastSentRecord, sendingDate);
	});
	
	it('calling suspend() should set the suspended flag to true, calling reactivate() should set it to false', function() {
		var email = 'test@testing.com';
		var newRecord = Record({ email });
		newRecord.suspend();
		assert.strictEqual(newRecord.suspended, true);
		newRecord.reactivate();
		assert.strictEqual(newRecord.suspended, false);
	});
});