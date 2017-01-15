var mongoose = require('mongoose'),
	app = require('./app/app'),
	config = require('./config'),
	worker = require('./workers/notification-worker');

mongoose.connect(config.DB_URL);

if (config.START_WORKER === true) {
	worker.start();
}

app.listen(config.SERVER_PORT, () => {
	console.log('server is live...');
});