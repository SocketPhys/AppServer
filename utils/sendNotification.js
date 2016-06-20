var secretData = require('../secret.json');
var btoa = require('btoa');
var request = require('request');

module.exports = function(notificationData, tokens, callback){
  console.log('\n\nsending notif to '+tokens+'\n\n');
  // Define relevant info
  var privateKey = secretData.privateApiKey;
  var appId = secretData.appId;

  // Encode your key
  var auth = btoa(privateKey + ':');

  // Build the request object
  var req = {
    method: 'POST',
    url: 'https://push.ionic.io/api/v1/push',
    headers: {
      'Content-Type': 'application/json',
      'X-Ionic-Application-Id': appId,
      'Authorization': 'basic ' + auth
    },
    data: {
      "tokens": 'DEV-d1c9c950-40e6-4a87-b3c9-12a5cc828c51',
      "notification": {
        "alert":"Hello World!"
      }
    }
  };

  // Make the API call
  request(req, callback);

}
