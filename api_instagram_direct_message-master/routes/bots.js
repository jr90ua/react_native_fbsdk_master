// Bot Routing
'use strict';

var express = require('express');
var router = express.Router();

var BotController = require('../controllers/botController');

// Post listening
router.post('/validate', BotController.validateBot);
router.post('/save/filters', BotController.saveFilters);
router.post('/add/comment', BotController.addComment);
router.post('/add/message', BotController.addReply);
router.post('/set/setting', BotController.setSettings);
router.post('/create', BotController.createNewBot);
router.post('/delete', BotController.deleteBotById);
router.post('/update/all', BotController.updateBotAllDetails);

module.exports = router;
