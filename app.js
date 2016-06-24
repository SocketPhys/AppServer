
var express = require('express');
var bodyParser = require('body-parser');
var array =[];
array = {
    'dubnation':[]

};
//var sendNotification = require('./utils/sendNotification.js');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// use mongo in production
var db = {}; // format -> city: [token, token...]
var tweetArray ={};
// store tokens under appropriate city in db
app.post('/register', function(req, res) {
  var token = req.body.token;
  var city = req.body.city;
  if(!(city in db))
    db[city] = [];
  db[city].push(token);
  console.log(JSON.stringify(db, null, 4));
  res.sendStatus(200);
});

  
  
  
  
  // send notification to registered users of a city
app.post('/notification', function(req, res) {
  var notificationData = req.body.data;
  var city = req.body.city;
  console.log('Sending notification: {'+notificationData+'} to tokens '+(db[city]||'none'));
  sendNotification(notificationData, db[city]||[], function(err, response, body){
    if(err)
      console.error(err);
    res.sendStatus(response.statusCode);
    console.log(JSON.stringify(response, null, 2));
  });
});


app.get('/sendTweets',function(req,res){

    var hashtag = req.query.hashtag;
    res.send(array[hashtag]);



});


function getTweets(){

    request.post({
        headers: {'content-type' : 'application/x-www-form-urlencoded', "Authorization": 'Basic WmR5Tk9tMHJQUlV3VVlwZm1iRDR3eTRCeTpFdVRoZ2FPSEZpNDJsM0h6azlYWjJwaWNCaFA2SFh0RnBDdkNycDN2Zk1zM29TV2NGYw=='},
        url:     'https://api.twitter.com/oauth2/token',
        body: 'grant_type=client_credentials'
    }, function(error, response, body){
        var token =JSON.parse(body)['access_token'];
        request.get({
            headers: {'content-type': 'application/json', 'Authorization':'Bearer ' + token},
            url: 'https://api.twitter.com/1.1/search/tweets.json?q=%23dubnations'

        },function(e,r,b){
            var json= JSON.parse(b);
            array = {
                'dubnation':[]

            };
            for(i=0;i<json['statuses'].length;i++){
                var id=json['statuses'][i]['id_str'];
                array.dubnation.push("https://twitter.com/statuses/" + id);

            }
        });
    });

}
app.listen(3000, function () {
  console.log('Listening on port 3000!');
  getTweets();
  setInterval(function(){ getTweets(); }, 30000);
});

