////////////////////////// GOOGLE MAPS GEOCODING API DATA /////////////////////////////////
var apiKeyG = "";
var urlG = "";
var userAddress = $("#search-field").val(); // capturing user's entry in location field

var latLong = { //to convert user's location search entry to lat/long format
   apiKeyG: "AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU",
   urlG: "https://maps.googleapis.com/maps/api/geocode/json",
   urlG: urlG + "?" + $.param({
       'address': userAddress,
       'key': apiKeyG
   }),
   lat: results.results.address-components.geometry.location.lat,
   long: results.results.address-components.geometry.location.lng
};

//https://maps.googleapis.com/maps/api/geocode/json?address=Croatia&key=AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU

$.ajax({
    url: urlG,
    method: GET
})

///////////////////////////////////// YOUTUBE API DATA /////////////////////////////////

//https://www.googleapis.com/youtube/v3/search?key=AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M&type=video&maxResults=5&part=snippet&chart=mostPopular&%E2%80%8Elocation=43.065041,-70.789078&videoCategoryId=10&videoEmbeddable=true

var apiKeyY = "AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";
var urlY = "https://www.googleapis.com/youtube/v3/search";
urlY += "?" + $.param({
   'type': 'video',
   'maxResults': 5,
   'part': 'snippet',
   'videoEmbeddable': true,
   'location': latLong.lat + "," + latLong.long,
   'locationRadius': '150mi',
   'key': apiKeyY,
   'chart': 'mostPopular'
})

$.ajax({
    url: urlY,
    method: GET
})