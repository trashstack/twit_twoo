"use strict";

function init() {
    
    var map_options = {
      center: new google.maps.LatLng(52.881, -1.97),
      zoom: 8
    };
    var map = new google.maps.Map($('.map').get(0), map_options);
    
    var tweet_coords = new google.maps.MVCArray();
    
    var heatmap = new google.maps.visualization.HeatmapLayer({data: tweet_coords});
    
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ];
    //heatmap.set('gradient', gradient);
    heatmap.set('radius', 20);
    heatmap.set('opacity', 0.5);
    heatmap.setMap(map);
    
    
    
    var socket = io();
    
    socket.on('tweet', function(tweet) {
        var coords =  new google.maps.LatLng(
            tweet.coordinates[0],
            tweet.coordinates[1]
        );
        
        tweet_coords.push(coords);
        
        /*
        var marker = new google.maps.Marker({
            position: coords,
            title: tweet.text
        });
        marker.setMap(map);
        */
    });
    
    socket.emit('add_location_stream', [49.87, -6.37, 55.81, 1.76]);
    
}

google.maps.event.addDomListener(window, 'load', init);

