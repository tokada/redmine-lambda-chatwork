Redmine-Lambda-ChatWork
==================

Post Redmine events to ChatWork using AWS Lambda through Amazon API Gateway.

## Preparation

Install Redmine WebHook Plugin to your Redmine.
https://github.com/tokada/redmine_webhook

## Install

Install npm libraries.
```
npm install request ejs
```

Zip all the files.
```
zip -r redmine-lambda-chatwork.zip *
```

Then, upload zip file to AWS Lambda function.

Prepare environment variables within AWS Lambda function:
- CHATWORK_TOKEN
- CHATWORK_ROOM_ID

## Usage

## Licence

[MIT](LICENSE)

## Author

[tokada](https://github.com/tokada)