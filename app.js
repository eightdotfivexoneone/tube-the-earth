////////////////////////// GOOGLE MAPS GEOCODING API DATA /////////////////////////////////
//to convert location user enters to lat/long

//https://maps.googleapis.com/maps/api/geocode/json?address=Croatia&key=AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU

var userAddress = "";
var childrenArray = [];

// Initialize Firebase
var config = {
    apiKey: "AIzaSyB4FzGqNZs6sYG5wsokxnFHJJutJSdbLTY",
    authDomain: "tube-the-earth.firebaseapp.com",
    databaseURL: "https://tube-the-earth.firebaseio.com",
    projectId: "tube-the-earth",
    storageBucket: "",
    messagingSenderId: "686431765231"
  };

firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function() {

//assign thumbnail AND video url to each of last 5 location search terms (for first object in array for that location search!!!!!!!) SO NOT THE SEARCH TERM ITSELF, BUT THE FIRST SEARCH RESULT FOR THAT LOCATION!!!!!!!!!!!!!!!!!

    //when data in database changes...
    database.ref().on("child_added", function(childSnapshot) { //each time another search is added to database...
        childrenArray.push(/* thumbnail */childSnapshot.val().userAddress); //push the new location the user entered to childrenArray
        var numChildren = childrenArray.length; //increment # of children by one
        if (numChildren < 6) { //if there are fewer than 5 children in database...
            $("#recent-searches").html(childrenArray.join(', ')); //push updated contents of childrenArray to page
        } else if (numChildren >= 6) {//otherwise, if there are 5+ children in database...
            childrenArray.shift();
            $("#recent-searches").html(childrenArray.join(', ')); //push updated contents of childrenArray to page
        }
    }); //ONCE IT GETS TO 6 ITEMS, ADDS NEXT ITEM TO BOTH BEGINNING AND END
    //africa asia ohio india (OLDEST) --> france asia ohio india france -- should be france africa asia ohio india SO ONLY ADD TO PLACE 4?

/*   }).then (function(results) {
        $("#popular").empty();
        for (i=0; i<5; i++) { //pushing 5 location-specific video thumbnails to page
            var thumbnailPath = results.items[i].snippet.thumbnails.default.url;
            var thumbnail = $("<img class='thumbnail'>").attr("src", thumbnailPath);
            $("#popular").append(thumbnail);  */

$("#search-button").on("click", function() {
    userAddress = $("#search-field").val().trim(); // capturing user's entry in location field
    event.preventDefault();

//push data to firebase
    database.ref().push({
        userAddress: userAddress, //add jesse's var for location
        });

    var apiKeyG = "AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU";
    var urlG = "https://maps.googleapis.com/maps/api/geocode/json";
    urlG = urlG + "?" + $.param({
        'address': userAddress,
        'key': apiKeyG
    });

$.ajax({
    url: urlG,
    method: "GET"
}).then

    (function(results) {
        
        var lat = results.results[0].geometry.location.lat;
        var long = results.results[0].geometry.location.lng;

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
        'locationRadius': '10mi',
        'key': apiKeyY,
        'chart': 'mostPopular'
    });

    $.ajax({
        url: urlY,
        method: "GET"
    }).then (function(results) {
        $("#popular").empty();
        for (i=0; i<5; i++) { //pushing 5 location-specific video thumbnails to page
            var thumbnailPath = results.items[i].snippet.thumbnails.default.url;
            var thumbnail = $("<img class='thumbnail'>").attr("src", thumbnailPath);
            $("#popular").append(thumbnail);
        }
        });
    });
});
});