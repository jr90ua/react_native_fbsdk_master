var express = require('express');
var router = express.Router();

var BotService = require('../services/botService');

/* GET dashboard page. */
router.get('/', function(req, res) {
  res.render('pages/dashboard');
});

/* GET dashboard page. */
router.get('/connect', function(req, res) {
  res.render('pages/connect');
});

/* GET all bots page. */
router.get('/allbots', function(req, res) {
  BotService.getAllBotDetail(function(callback) {
    res.render('pages/allbots', {bots : callback});
  });
});

/* GET dashboard page. */
// router.get('/', function(req, res) {
//   res.render('pages/dashboard');
// });

/* GET dashboard page. */
// router.get('/', function(req, res) {
//   res.render('pages/dashboard');
// });

module.exports = router;
