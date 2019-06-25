// Bot controller
'use strict';

var fork = require('child_process').fork,
    path = require('path');

var BotService = require('../services/botService'),
    BotModel = require('../models').Bot,
    CommentModel = require('../models').Comment,
    ReplyModel = require('../models').Reply,
    SettingModel = require('../models').Setting;


/**
 * Global variables to set the bot.
 * all of these variables had been initialized from logic.
 */
var BotController = {};
var arrBotProcess = [];
var arrBotProcessName = [];
var arrBotProcessBackup = [];
var arrBotProcessNameBackup = [];
var botNum = 0;
/**
 * create new bot using thread.
 * @param {object} req
 * @param {object} res
 */
BotController.createNewBot = function(req, res) {
    if(!req.body.botId) {
        res.status(404).json({
            flag: false,
            message: 'Invalid server connection.'
        });
    } else {
        var botId = req.body.botId,
            potentialBotId = { where: { id: botId } };

        var updateBotData = {
            status: 1
        }
        
        BotModel.update(updateBotData, potentialBotId)
            .then(function(response) {
                if(response[0] == 1) {
                    // Fetch bot setting => max comments count.
                    SettingModel.findAll({
                        where: {
                            bot_id: botId
                        }
                    }).then(function(settings) {
                        var maxDailyComment;

                        for(var obj of settings) {
                            maxDailyComment = obj.dataValues.max_comment_daily;
                        }
                        
                        console.log(maxDailyComment);
                        // Fetch Bot Detail => delay
                        BotModel.findAll({
                            where: {
                                id: botId
                            }
                        }).then(function(bot) {
                            var delay;
                            for(var obj of bot) {
                                delay = obj.dataValues.delay;
                            }

                            var sendData = {
                                botId: req.body.botId,
                                delayTime: delay,
                                maxDailyComment: maxDailyComment
                            }
                            
                            arrBotProcess.push(fork(path.join(__dirname, 'newBotProcess.js')));
                            arrBotProcessName.push(botId);

                            arrBotProcess[botNum].on('message', function(data) {
                                if(data == 1) {
                                    res.status(201).json({
                                        flag: true,
                                        message: 'Created your Bot perfectly'
                                    });

                                } else {
                                    res.status(404).json({
                                        flag: false,
                                        message: 'Invalid create bot'
                                    });  
                                }
                            });
                            
                            arrBotProcess[botNum].send(sendData);
                            botNum = botNum + 1;

                    }).catch(function(error) {
                        console.log('Fetch Bot Detail Error: ' + error);
                    })
                }).catch(function(error) {
                    console.log('Fetch Bot Setting Error: ' + error);
                });
                
            }
        })
        .catch(function(error) {
            console.log('Create new bot error: ' + error);
        });
    }
}

/**
 * validate user to create new user.
 * @param {object} req
 * @param {object} res
 */
BotController.validateBot = function(req, res) {
    if(!req.body.botName || !req.body.userName || !req.body.password) {
        res.status(404).json({
            flag: false,
            message: 'Invalid server connection.'
        });
    } else {
        var botName = req.body.botName,
            name = req.body.userName,
            password = req.body.password,
            delay = req.body.delay;

        BotService.validateBot(name, password, function(callback) {
            if(callback.flag == false) {
                switch(callback.type) {
                    case 'CheckpointError':
                        res.status(404).json({
                            flag: false,
                            message: 'You need to login your user'
                        });

                        break;
                    case 'AuthenticationError':
                        res.status(404).json({
                            flag: false,
                            message: 'Authentication Error, Please retype your user detail.'
                        });
                        
                        break;
                    case 'CreateError':
                        res.status(404).json({
                            flag: false,
                            message: 'Creating Session Error.'
                        });

                        break;
                }
            } else {
                var newBotData = {
                    user_id: 1,
                    botname: botName,
                    name: name,
                    password: password,
                    delay: delay,
                    status: 0
                }
                BotModel.create(newBotData)
                    .then(function(bot) {
                        res.status(201).json({
                            flag: true,
                            message: 'Successfully validated your bot.',
                            botId: bot.dataValues.id
                        });
                    })
                    .catch(function(error) {
                        console.log('Save new bot error: ' + error);
                    });
            }
        });

    }
    
}

/**
 * saveFilters with bot_id, user_id
 * @param {object} req
 * @param {object} res
 */
BotController.saveFilters = function(req, res) {
    if(req.body.botId == 0 || !req.body.filters) {
        res.status(404).json({
            flag: false,
            message: 'Invalid server connection.'
        });
    } else {
        var botId = req.body.botId,
            filters = req.body.filters,
            potentialBotId = { where: { id : botId} };
        
        var updateBotData = {
            filters: JSON.stringify(filters)
        }

        BotModel.update(updateBotData, potentialBotId)
            .then(function(response) {
                if(response[0] == 1) {
                    res.status(201).json({
                        flag: true,
                        message: 'Successfully updated your bot with filters.',
                        botId: botId
                    });
                }
            })
            .catch(function(error) {
                console.log('Update bot data error: ' + error);
            });
    }
}

/**
 * add comment with bot_id
 * @param {object} req
 * @param {object} res
 */
BotController.addComment = function(req, res) {
    if(!req.body.botId) {
        res.status(404).json({
            flag: false,
            message: 'Invalid add comment'
        });
    } else {
        var botId = req.body.botId,
            comment = req.body.comment;

        var newComment = {
            bot_id: botId,
            comment: comment
        }

        CommentModel.create(newComment)
            .then(function(comment) {
                if(comment) {
                    res.status(201).json({
                        flag: true,
                        message: 'Added your comment correctly!',
                        comment: comment.dataValues.comment,
                        botId: botId
                    });
                } else {
                    res.status(404).json({
                        flag: false,
                        message: 'Invalid add comment'
                    });
                }
            })
            .catch(function(error) {
                console.log('Save comment error: ' + error);
            });
    }
    
}

/**
 * add message to reply databse
 * @param {object} req
 * @param {object} res
 */
BotController.addReply = function(req, res) {
    console.log(req.body.botId);
    if(!req.body.message) {
        res.status(404).json({
            flag: false,
            message: 'Invalid add message'
        });
    } else {
        var botId = req.body.botId,
            message = req.body.message;

        var newReply = {
            bot_id: botId,
            message: message
        }

        ReplyModel.create(newReply)
            .then(function(message) {
                if(message) {
                    res.status(201).json({
                        flag: true,
                        message: 'Added your comment correctly!',
                        reply: message.dataValues.message,
                        botId: botId
                    });
                } else {
                    res.status(404).json({
                        flag: false,
                        message: 'Invalid add comment'
                    });
                }
            })
            .catch(function(error) {
                console.log('Save replies error: ' + error);
            });
    }
}

/**
 * set setting to settings table.
 * @param {object} req
 * @param {object} res
 */
BotController.setSettings = function(req, res) {
    if(!req.body.botId) {
        res.status(404).json({
            flag: false,
            message: 'Invalid to update your setting.'
        });
    } else {
        var botId = req.body.botId,
            maxCommentDaily = req.body.maxCommentDaily,
            potentialBotId = { where: { bot_id: botId}};

        var upsertSettingData = {
            bot_id: botId,
            max_comment_daily: maxCommentDaily
        }

        SettingModel.upsert(upsertSettingData, potentialBotId)
            .then(function(setting) {
                if(setting) {
                    res.status(201).json({
                        flag: true,
                        message: 'Changed your setting correctly!',
                        maxCommentDaily: maxCommentDaily,
                        botId: botId
                    });
                } else {
                    res.status(404).json({
                        flag: false,
                        message: 'Invalid add comment'
                    });
                }
            })
            .catch(function(error) {
                console.log('Save Settings error: ' + error);
            });
    }
}

/**
 * delete bot by ID.
 * @param {object} req
 * @param {object} res
 */
BotController.deleteBotById = function(req, res) {
    console.log(req.body);
    if(req.body.id) {
        var potentialBotId = { where: { id: req.body.id } };

        var updateBotData = {
            status: 0
        }

        for(var i = 0; i < arrBotProcessName.length; i++) {
            if(arrBotProcessName[i] == req.body.id) {
                arrBotProcess[i].kill();
                arrBotProcessName[i] = "###";
            }
        }

        /**
         * 1. loop for bot list and pop empty bot
         * 
         */
        arrBotProcessBackup = [];
        arrBotProcessNameBackup = [];

        for(var kk = 0; kk < arrBotProcessName.length; kk++)
        {
            if(arrBotProcessName[kk] != "###")
            {
                arrBotProcessBackup.push(arrBotProcess[kk]);
                arrBotProcessNameBackup.push(arrBotProcessName[kk]);
            }                            
        }
        /**
         * initialize and copy original thread array for bots with backup arraylist
         */
        arrBotProcess = [];
        arrBotProcessName = [];

        arrBotProcess = arrBotProcessBackup.slice(0);
        arrBotProcessName = arrBotProcessNameBackup.slice(0);

        BotModel.update(updateBotData, potentialBotId)
            .then(function(response) {
                console.log(response[0]);
                res.status(201).json({
                    flag: true,
                    message:'Successfully deleted'
                });
            })
            .catch(function(error) {
                console.log('Delete Bot Error: ' + error);
            });
    }
}

/**
 * update bot all details.
 * @param {OBJECT} req
 * @param {OBJECT} res
 */
BotController.updateBotAllDetails = function(req, res) {
    console.log(req.body);

    var botId = req.body.botId,
        botName =  req.body.botName,
        accountName = req.body.accountName,
        delay = req.body.delay,
        password = req.body.password,
        arrFilter = req.body.arrFilter,
        arrReply = req.body.arrReply,
        arrComment = req.body.arrComment,
        potentialBotId = { where: { bot_id: botId } };

    var updateBotData = {
        botname: botName,
        name: accountName,
        password: password,
        delay: delay,
        filters: arrFilter
    }

    BotModel.update(updateBotData, potentialBotId)
        .then(function(response) {
            if(response[0] == 1) {
                res.status(200).json({
                    flag: true,
                    message: 'Succesfully updated your bot details'
                });
            } else {
                res.status(404).json({
                    flag: false,
                    message: 'Invalid database connection!'
                });
            }
        })
        .catch(function(error) {
            if(error) {
                console.log('Update Bot detail error: ' + error);
            }
        });

    BotService.getCommentAllDataByBotId(botId, function(comments) {
        for(var obj of comments) {
            CommentModel.destroy({
                where: {
                    id: obj.id
                }
            })
            .then(function(result) {
                if(result == 1) {
                    console.log('deleted!');
                }
            })
            .catch(function(error) {
                console.log('Delete current row error: ' + error);
            })
        }
    });

    arrComment.forEach(element => {
        var newCommentRow = {
            bot_id: botId,
            comment: element[i]
        }

        console.log(newCommentRow);

        CommentModel.create(newCommentRow)
            .then(function(commentResponse) {
                console.log(commentResponse.dataValues);
            })
            .catch(function(error) {
                console.log('Create new Row at comment error: ' + error);
            })
    });

    BotService.getDirectMessageByBotId(botId, function(replies) {
        for(var obj of replies) {
            ReplyModel.destroy({
                where: {
                    id: obj.id
                }
            })
            .then(function(result) {
                if(result == 1) {
                    console.log('deleted!');
                }
            })
            .catch(function(error) {
                console.log('Delete current row error: ' + error);
            })
        }
    });

    arrReply.forEach(element => {
        var newReplyRow = {
            bot_id: botId,
            message: element
        }

        console.log(newReplyRow);

        ReplyModel.create(newReplyRow)
            .then(function(replyResponse) {
                console.log(replyResponse.dataValues);
            })
            .catch(function(error) {
                console.log('Create new Row at reply error: ' + error);
            });
    });
}

module.exports = BotController;