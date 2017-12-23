/*
 * debug.js
 * http://github.com/tokada/redmine-lambda-chatwork/
 *
 * Post request body to Amazon API Gateway directly as message to ChatWork.
 * This is a script for AWS Lambda.
 * 
 * Install: Prepare environment variables CHATWORK_TOKEN and CHATWORK_ROOM_ID
 */

var request = require('request');

exports.handler = function(event, context) {
  var options = {
    url: 'https://api.chatwork.com/v2/rooms/' + process.env.CHATWORK_ROOM_ID +'/messages',
    headers: {
      'X-ChatWorkToken': process.env.CHATWORK_TOKEN
    },
    form : { body : '[code]'+event.body+'[/code]' },
    useQuerystring: true
  };

  if (!process.env.CHATWORK_TOKEN || !process.env.CHATWORK_ROOM_ID) {
    context.done('error', { statusCode: 200, headers: {}, body: JSON.stringify({
      error: { message: "Environment variable CHATWORK_TOKEN or CHATWORK_ROOM_ID required" } })});
    return;
  }

  request.post(options, function(err, res, body) {
    var response = {
      statusCode: 200,
      headers: {},
      body: body
    };
    if (!err && res.statusCode == 200) {
      context.succeed(response);
    }else{
      context.done('error', response);
    }
  });
};
