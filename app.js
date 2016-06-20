var express = require('express');
var bodyParser = require('body-parser');

var sendNotification = require('./utils/sendNotification.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// use mongo in production
var db = {}; // format -> city: [token, token...]

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

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
