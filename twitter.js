var Twit = require('twit');

var twit = new Twit({
    consumer_key: 'f2LX3MTUlgoOGNbHim1mg',
    consumer_secret: '9jQcIGGHXTrDcj0PzyYHK2gAG2dLfvWsJfYFsfbko',
    access_token: '48991537-y0kJjEj2IyJaq7reW16erVJOqN9egF102LyKXtybT',
    access_token_secret: 'VAseaxGMkCZgd6FrY9Zc5qAzK9zGnfePqKHjKLIR6nxvZ',
});


exports.search = function(cb) {
    twit.get('search/tweets', {q: 'arts alliance media', count: 10}, function(err, reply) {
        if (err) cb(err);
        cb(null, reply.statuses);
    });
};


exports.search_stream = function(search) {
    var stream = twit.stream('statuses/filter', {track: search});
    return stream;
};


exports.location_stream = function(bounding_box) {
    // Deal with the twitter coords being weird
    bounding_box = [
        bounding_box[1],
        bounding_box[0],
        bounding_box[3],
        bounding_box[2]
    ];
    var stream = twit.stream('statuses/filter', {locations: bounding_box});
    return stream;
};

