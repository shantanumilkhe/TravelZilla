const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

// Link to views folder.
let views = path.join(__dirname, '../');

// Home route.
router.get('/', (req, res) => {
  res.sendFile('home.html', { root: views });
});

// Other routes.
router.get('/bnbs', function(req, res){
  res.sendFile('bnbs.html', { root: views });
});
router.get('/bnbs/:id/reviews', function(req, res){
  res.sendFile('reviews.html', { root: views });
});
router.get('/users', function(req, res){
  res.sendFile('users.html', { root: views });
});
router.get('/hotel', function(req, res){
  res.sendFile('hotel.html', { root: views });
});

// app.use('/bnbs', bnbs)
// app.use('/bnbs/:id/reviews', reviews)
// app.use('/', users)
// app.use('/hotel',hotel)

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda (express/server.js)

module.exports = app;
module.exports.handler = serverless(app);