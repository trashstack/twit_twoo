"use strict";

$(document).ready(function() {
    
    var count = 0;
    setInterval(function() {
        $('.rate').html(count * 10);
        count = 0;
    }, 6000);
    
    var socket = io();
    
    socket.on('tweet', function(tweet) {
        $('.tweet > :nth-child(20)').remove();
        $('.tweet').prepend('<p>' + tweet.text + '</p>');
        count++;
    });
    
    $('.add_stream').on('click', function() {
        var $stream_search = $('input[name="stream_search_string"]');
        var stream_search = $stream_search.val();
        socket.emit('add_stream', stream_search);
        $('.streams').append('<li>' + stream_search + '</li>');
        $stream_search.val('');
    });
    
    $('.clear_streams').on('click', function() {
        socket.emit('clear_streams');
        $('.streams').empty();
    });
});
