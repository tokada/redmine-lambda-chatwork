/*
 * index.js
 * http://github.com/tokada/redmine-lambda-chatwork/
 *
 * Edit request body to Amazon API Gateway with corresponding template and post as a message to ChatWork.
 * This is a script for AWS Lambda.
 * 
 * Install: Prepare environment variables CHATWORK_TOKEN and CHATWORK_ROOM_ID
 */

var request = require('request');
var ejs = require('ejs');
var fs = require('fs');

var makeResponse = function(statusCode, body) {
    if (typeof(body) != 'string') {
        body = JSON.stringify(body);
    }
    return {
        statusCode: statusCode,
        headers: {'Content-Type': 'application/json'},
        body: body
    };
}

var chooseTemplate = function(templateName) {
  return fs.readFileSync('templates/'+templateName+'.ejs', 'utf-8');
}

exports.handler = function(event, context) {
  var requestBody = JSON.parse(event.body);
  var requestQuery = event.queryStringParameters;

  if (!process.env.CHATWORK_TOKEN) {
    context.done('error', makeResponse(200, { error: { message: "Environment variable CHATWORK_TOKEN required" } }));
    return;
  }
  if (!requestQuery.room_id) {
    context.done('error', makeResponse(200, { error: { message: "Query string parameter room_id required" } }));
    return;
  }

  // choose template
  var template = null;
  if (requestBody.payload && requestBody.payload.action == 'opened') {
    template = chooseTemplate('issue_opened');
  }
  else if (requestBody.payload && requestBody.payload.action == 'updated') {
    template = chooseTemplate('issue_updated');
  }

  if (!template) {
    context.done('error', makeResponse(200, { error: { message: "No template matched for request body", body: event.body } }));
    return;
  }

  var msg = ejs.render(template, { event: requestBody.payload });
  var options = {
    url: 'https://api.chatwork.com/v2/rooms/' + requestQuery.room_id +'/messages',
    headers: {
      'X-ChatWorkToken': process.env.CHATWORK_TOKEN
    },
    form : { body : msg },
    useQuerystring: true
  };

  request.post(options, function(err, res, body) {
    var response = makeResponse(200, body);
    if (!err && res.statusCode == 200) {
      context.succeed(response);
    }else{
      context.done('error', response);
    }
  });
};
