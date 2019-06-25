/**
 * 
 * 
 * 
 * 
 * 
 * 
 */

'use strict';

$(document).ready(function() {
    // Connect.js global variables.
    var gBotId = 0;

    /**
     * Send Data to backend with Ajax.
     * @param {string} url
     * @param {string} method
     * @param {object} data
     * @returns {object} @param callback
     */
    this.sendData = function(url, method, data, callback) {
        $.ajax({
            type: method,
            url: url,
            data: data,
            dataType: 'json',
            async: false
        }).done(function(response) {
            callback(response);
        }).catch(function(response) {
            callback(response);
        });
    }

    /*  Begin validate bot tab pannel */
    // validate bot global variables
    var botName = $('input#botName.form-control');
    var userName = $('input#userName.form-control');
    var responseDelay = $('input#responseDelay.form-control');
    var password = $('input#password.form-control');
    // validate bot button click event
    this.validateBot = function(){
        if(botName.val() && userName.val() && password.val()) {
            var newBotData = {
                botName: botName.val(),
                userName: userName.val(),
                password: password.val(),
                delay : responseDelay.val()
            }
            var url = '/bot/validate';
            var method = 'POST';

            this.sendData(url, method, newBotData, function(callback) {
                if(callback.flag == true) {
                    gBotId = callback.botId;

                    // change tab to filters
                    $('a#validate-tab.nav-link.active').attr('aria-selected', 'false');
                    $('div#validate-pan.tab-pane.fade.show.active').removeClass('active show');
                    $('a#validate-tab.nav-link.active').removeClass('active show');

                    $('a#filter-tab.nav-link').attr('aria-selected', 'true');
                    $('div#filter-pan.tab-pane.fade').addClass('active show');
                    $('a#filter-tab.nav-link').addClass('active show');
                } else {
                    // output error to page.
                    console.log(callback);
                }
            });
            
        }
    }

    /*  Begin save filters(hash tags) tab pannel */
    // save filters global variables.
    var filters = $('textarea#filters.form-control');
  
    this.saveFilters = function() {
        if (filters.val()) {
            var arrFilters = filters.val().replace(/ /g, '').split(','),
                url = '/bot/save/filters',
                method = 'POST';

            var sendData = {
                botId: gBotId,
                filters: arrFilters
            }

            this.sendData(url, method, sendData, function(callback) {
                console.log(callback);
                if(callback.flag == true) {
                    gBotId = callback.botId;

                    // change tab to filters
                    $('a#filter-tab.nav-link.active').attr('aria-selected', 'false');
                    $('div#filter-pan.tab-pane.fade.show.active').removeClass('active show');
                    $('a#filter-tab.nav-link.active').removeClass('active show');

                    $('a#comment-tab.nav-link').attr('aria-selected', 'true');
                    $('div#comment-pan.tab-pane.fade').addClass('active show');
                    $('a#comment-tab.nav-link').addClass('active show');
                } else {
                    console.log(callback);
                }
            });
        } 
    }

    /* Begin add comment tab panel */
    // add comment global variables.
    var showComment = $('textarea#show-comments.form-control');
    var comment = $('input#comment.form-control');

    var indexComment = 1;

    this.addComment = function() {
        if(comment.val()) {
            var url = '/bot/add/comment';
            var method = 'POST';
            var sendData = {
                botId: gBotId,
                comment: comment.val()
            }

            this.sendData(url, method, sendData, function(callback) {
                if(callback.flag == true) {
                    var appendCommentString = indexComment + '. ' + callback.comment + '\n';
                     
                    gBotId = callback.botId;
                    showComment.append(appendCommentString);
                    indexComment++;
                    comment.val('');
                } else {
                    console.log(callback);
                }
            });
        }
    }
    
    /* Begin add message tab panel */
    // add message global variables.
    var showMessages = $('textarea#show-messages.form-control');
    var message = $('input#message.form-control');
    var indexMessage = 1;

    this.addMessages = function() {
        if(message.val()) {
            var url = '/bot/add/message';
            var method = 'POST';
            var sendData = {
                botId: gBotId,
                message: message.val()
            }

            this.sendData(url, method, sendData,  function(callback) {
                if(callback.flag == true) {
                    var appendMessageString = indexMessage + '. ' + callback.reply + '\n';
                     
                    gBotId = callback.botId;
                    showMessages.append(appendMessageString);
                    indexMessage++;
                    message.val('');
                } else {
                    console.log(callback)
                }
            })
        }
    }

    /* Begin add activity setting tab panel */
    // set the global setting bot.
    var maxCommentDaily = $('input#max-comment-daily.form-control');
    
    this.saveSetting = function() {
        if(maxCommentDaily.val()) {
            var url = '/bot/set/setting';
            var method = 'POST';
            var sendData = {
                botId: gBotId,
                maxCommentDaily: maxCommentDaily.val()
            }

            this.sendData(url, method, sendData, function(callback) {
                if(callback.flag == true) {
                    maxCommentDaily.val(callback.maxCommentDaily);
                    console.log(callback);
                } else {
                    console.log(callback);
                }
            });
        } 
    }

    /* Create new bot fucntion */
    this.createNewBot = function() {
        var url = '/bot/create'
        var method = 'POST';
        var sendData = {
            botId: gBotId
        }

        this.sendData(url, method, sendData, function(callback) {
            if(callback.flag == true) {
                gBotId = 0;
                location.reload();
            } else {
                console.log(callback);
            }
        });
    }

    /**
     * Test create bot function
     */

    // this.createNewBot = function() {
    //     var url = '/bot/create'
    //     var method = 'POST';
    //     var sendData = {
    //         botId: 1
    //     }

    //     this.sendData(url, method, sendData, function(callback) {
    //         if(callback.flag == true) {
    //             gBotId = 0;
    //             console.log(callback);
    //         } else {
    //             console.log(callback);
    //         }
    //     });
    // }
});

