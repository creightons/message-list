# message-list

## Synopsis

A simple program that lets you add yourself to a mailing list. Sign up and once a day you will get a message from the server. You can also choose to quit, suspend, or reactivate your account.

Emails are sent using nodemailer. You need to provide credentials to an existing Gmail account to send emails. Provide this information in the config file.

Needs a mongoDB instance running to store data and run integration tests.

All tests run using Mocha.
