var mongoose = require('mongoose'),
	Promise = require('bluebird');
	
Promise.promisifyAll(mongoose);

var Schema = mongoose.Schema;

var recordSchema = new Schema({
	email: { type: String, required: true, unique: true },
	currentIndex: { type: Number, default: 0 },
	lastSentRecord: { type: Date, default: null },
	suspended: { type: Boolean, default: false },
	finished: { type: Boolean, default: false },
	createdAt: Date,
	updatedAt: Date,
});

recordSchema.methods.incrementRecord = function(date) {
	this.currentIndex += 1;
	if (this.currentIndex === 10) {
		this.finished = true;
	}
	this.lastSentRecord = date;
};

recordSchema.methods.suspend = function() {
	this.suspended = true;
};

recordSchema.methods.reactivate = function() {
	this.suspended = false;
};

var Record = mongoose.model('Record', recordSchema);

module.exports = Record; 