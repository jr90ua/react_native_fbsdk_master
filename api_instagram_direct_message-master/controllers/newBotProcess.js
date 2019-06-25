// new instagram bot.
'use strict';

var BotService = require('../services/botService');

process.on('message', function(data) {
    var botId = data.botId;
    var delayTime = data.delayTime;
    var maxDailyComment = data.maxDailyComment;

    // get bot detail from bots table.
    BotService.getBotDetail(botId, function(botDetail) {
        var userName = botDetail.name,
            password = botDetail.password,
            filters = JSON.parse(botDetail.filters);

        // validate bot using users.
        BotService.validateBot(userName, password, function(callback) {
            if(callback.flag == true) {
                BotService.getCommentByBotId(botId, function(comments) {
                    var session = callback.session;
                    
                    // var startTime = (new Date()).getTime();
                    var startTime = 0;

                    // var commentStartTime = (new Date()).getTime();
                    var commentStartTime = 0;

                    
                    // Direct message for  real-time.
                    setInterval(() => {
                            
                        /**
                         * 1. define time variable to save start time
                         * 2. get currnet system time 
                         * 3. calcuate current system time - start time
                         * 4. if ( delte time > setted delta time)
                         * 5. execute followed logic
                         * 6. start time  =  current system time at end of this logic
                         */
                        
                        if(delayTime <= 0) 
                        {
                            console.log("Please set delaytime over 1.");
                        }
                        else 
                        {  
                            if((new Date()).getTime() - startTime >= delayTime * 1000)
                            {
                                var countHistory = 0;
                                // Get replies by bot_id from database.
                                BotService.getDirectMessageByBotId(botId, function(replies) {
                                    BotService.getReplyDirectMessageHistoryByBotId(botId, function(callback) {
                                        countHistory = callback;
                                    });

                                    BotService.getResposerDataFromInbox(session, function(responseData){
                                        var id = responseData.id;
                                        var messageFromUser = responseData.message;
                                            
                                            //console.log(replies[countMakeReplyByBot]);
                                            /**
                                             * 1. reply message hostory count.
                                             * 2. current reply list and count.
                                             */
                                            var replyMessage = replies[countHistory % replies.length].message,
                                                replyId = replies[countHistory % replies.length].id;


                                        if (parseInt(id) > 0 && messageFromUser) {
                                            BotService.replyToUserByRespnserId(session, id, replyMessage, function(replyReponseData) {
                                                var messagerId = replyReponseData.id;
                                                var messagerName = replyReponseData.name;
            
                                                BotService.storeReplyDirectMessageHistory(botId, messagerId, messagerName, messageFromUser, replyId, function(srdmhs) {
                                                    console.log(srdmhs);
                                                });
                                            });
                                        } 

                                    });
                                });

                                startTime = (new Date()).getTime();
                            }
                        }
                     }, 10);

                    // Make comment to post using media_id.
                    var countFilter = filters.length;
                    var miliTimePerDay = 24 * 60 * 60 * 1000;
                    var commentInterval = miliTimePerDay / miliTimePerDay;
                    

                    if( (new Date()).getTime() - commentStartTime >= commentInterval ) 
                    {
                        console.log("Please set maxDailyComment over 1.");
                        // Make commit for application
                        async function getMediaIdFromAPI() {
                            countFilter--;
                            var hashTag = filters[countFilter];

                            BotService.getMediaIdByHashtag(session, hashTag, function(arrMediaId) {
                                var countMediaId = arrMediaId.length;

                                async function postComment() {
                                    countMediaId--;
                                    var mediaId = arrMediaId[countMediaId];
                                    var randomComment = comments[getRandomInt(comments.length)];

                                    BotService.commitPostsByMediaId(session, mediaId, randomComment, function(callback) {
                                        //console.log(callback);
                                    });

                                    // delay time for make the commit.
                                    if(countMediaId > 0) {
                                        setTimeout(postComment, 60000);
                                    }
                                }
                                postComment();
                            });

                            // delay the time for get the media_id
                            if(countFilter > 0) {
                                setTimeout(getMediaIdFromAPI, 60000);
                            }
                        }

                        getMediaIdFromAPI();

                        commentStartTime = (new Date()).getTime();
                    } 

                    process.send(1);
                });
            } else {
                console.log(callback);
            }
        });
    });

    /**
     * Get random number to fetch data from database.
     * @param {*} max 
     */
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
});