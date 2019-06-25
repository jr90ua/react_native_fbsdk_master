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

    /**
     * Delete bot by botID,
     * @param {number} id
     */
    this.deleteBot = function(id) {
        if(id) {
            var url = '/bot/delete';
            var method = 'POST';
            var deleteBotData = {
                id: id
            }
            this.sendData(url, method, deleteBotData, function(callback) {
                console.log(callback);
                if(callback.flag == true) {
                    location.reload();
                }
            });
        }
    }

    this.updateBotSetting = function(id) {
        var botName = $('input#botName.form-control'),
            accountName =  $('input#accountName.form-control'),
            delay = $('input#delay.form-control'), 
            password = $('input#password.form-control'),
            filters = $('textarea#filters.form-control'), 
            comments = $('textarea#comments.form-control'), 
            replies = $('textarea#replies.form-control');

        var arrFilter = filters.val().trim().split(','),
            arrComment = comments.val().trim().split(','),
            arrReply = replies.val().trim().split(','); 

        var sendData = {
            botId: id,
            botName: botName.val(),
            accountName: accountName.val(),
            delay: delay.val(),
            password: password.val(),
            arrFilter: arrFilter,
            arrComment: arrComment,
            arrReply: arrReply
        }

        console.log(sendData);

        var url = '/bot/update/all',
            method = 'POST';

        this.sendData(url, method, sendData, function(callback) {
            if (callback.flag == true) {
                console.log(callback);
            } else {
                console.log(callback);
            }
        });
    }
});