////////////////////////// GOOGLE MAPS GEOCODING API DATA /////////////////////////////////
//to convert location user enters to lat/long

//https://maps.googleapis.com/maps/api/geocode/json?address=Croatia&key=AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU

$(document).ready(function() {

    $("#search-button").on("click", function() {
        var userAddress = $("#search-field").val(); // capturing user's entry in location field
        console.log(userAddress)

var apiKeyG = "AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU";
var urlG = "https://maps.googleapis.com/maps/api/geocode/json";
urlG = urlG + "?" + $.param({
       'address': userAddress,
       'key': apiKeyG
   });

console.log(userAddress);

$.ajax({
    url: urlG,
    method: "GET"
}).then


    (function(results) {
        console.log(results.geometry.location)

        var lat = results.geometry.location.lat;
        var long = results.geometry.location.lng; //necessary to parse??

        //console.log(lat);
        //console.log(results.geometry.location);  //RESPONSE OR RESULTS??????????????

///////////////////////////////////// YOUTUBE API DATA /////////////////////////////////

//https://www.googleapis.com/youtube/v3/search?key=AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M&type=video&maxResults=5&part=snippet&chart=mostPopular&%E2%80%8Elocation=43.065041,-70.789078&videoCategoryId=10&videoEmbeddable=true

    var apiKeyY = "AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";
    var urlY = "https://www.googleapis.com/youtube/v3/search";
    urlY += "?" + $.param({
        'type': 'video',
        'maxResults': 5,
        'part': 'snippet',
        'videoEmbeddable': true,
        'location': lat + "," + long,
        'locationRadius': '150mi',
        'key': apiKeyY,
        'chart': 'mostPopular'
    });

    $.ajax({
        url: urlY,
        method: "GET"
    }).then (function(results) {
        var thumbnailPath = results.items.snippet.thumbnails.default;
        var thumbnail = JSON.parse(thumbnailPath);
    })
});
});
})

/*
for (i = 0; i < myJSONResult.results.length; i++) {
  myAddress[i] = myJSONResult.results[i].formatted_address;
}
*/