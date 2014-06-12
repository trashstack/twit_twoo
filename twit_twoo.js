var express = require('express'),
    twitter = require('./twitter');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res, next) {
    res.sendfile('static/index.html');
});

app.get('/map', function(req, res, next) {
    res.sendfile('static/map.html');
});

app.use(express.static(__dirname + '/static'));

io.on('connection', on_connection);

io.on('disconnect', on_disconnect);

function on_connection(socket) {
    socket.twitter_streams = [];
    socket.on('add_stream', add_stream(socket));
    socket.on('clear_streams', clear_streams(socket));
    socket.on('add_location_stream', add_location_stream(socket));
}

function add_stream(socket) {
    var _add_stream = function(data) {
        var stream = twitter.search_stream(data);
        stream.on('tweet', function(tweet) {
            socket.emit('tweet', {text: tweet.text});
        });
        socket.twitter_streams.push(stream);
    };
    return _add_stream;
}

function clear_streams(socket) {
    var _clear_streams = function() {
        stop_streams(socket.twitter_streams);
    };
    return _clear_streams;
}

function stop_streams(streams) {
    var stream = socket.twitter_streams.pop();
    while (stream) {
        stream.removeAllListeners();
        stream.stop();
    }
}

function add_location_stream(socket) {
    var _add_location_stream = function(bounding_box) {
        var stream = twitter.location_stream(bounding_box);
        stream.on('tweet', function(tweet) {
            var coordinates;
            if (tweet.coordinates && tweet.coordinates.type === 'Point') {
                coordinates = tweet.coordinates.coordinates;
            } else if (tweet.place && tweet.place.bounding_box) {
                var longitudes = tweet.place.bounding_box.coordinates[0][0].map(function(c) {
                    return c[0];
                });
                var latitudes = tweet.place.bounding_box.coordinates[0][0].map(function(c) {
                    return c[1];
                });
                coordinates = [
                    longitudes.reduce(function(a, b) { return a + b; }) / longitudes.length,
                    latitudes.reduce(function(a, b) { return a + b; }) / latitudes.length
                ];
            }
            // Deal with twitter coord order
            coordinates = [
                coordinates[1],
                coordinates[0]
            ];
            socket.emit('tweet', {text: tweet.text, coordinates: coordinates});
        });
        socket.twitter_streams.push(stream);
    };
    return _add_location_stream;
}

function on_disconnect(socket) {
    stop_streams(socket.twitter_streams);
}


http.listen(80, function() {
    console.log('Listening on port 80');
});

