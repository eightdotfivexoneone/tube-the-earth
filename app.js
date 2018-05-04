////////////////////////// GOOGLE MAPS GEOCODING API DATA /////////////////////////////////
//to convert location user enters to lat/long

//https://maps.googleapis.com/maps/api/geocode/json?address=Croatia&key=AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU

var userAddress = "";
var childrenArray = [];
var thumbnail;
var popularThumbnailArray = [];

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
    //when data in database changes, and on page load...
    database.ref().on("child_added", function(childSnapshot) {
                
        childrenArray.push(childSnapshot.val().userAddress); //push the new location the user entered to childrenArray
//BUT DON'T WANT THIS PRINTED TO PAGE, JUST ADDED TO ARRAY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    });

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
    }).then (function(response) {
        $("#user-results").empty();
        for (var i=0; i<5; i++) { //pushing 5 location-specific video thumbnails to page
            var userThumbnailPath = response.items[i].snippet.thumbnails.default.url;
            var userThumbnail = $("<img class='user-thumbnail'>").attr("src", userThumbnailPath);
            $("#user-results").append(userThumbnail);
        }
        
        var popularSearchesArray = []; //to hold last 5 children in database
        var query = firebase.database().ref().orderByKey(); //grabbing data from firebase
        query.once("value")
            .then(function(snapshot, childSnapshot) {
                var length = snapshot.numChildren(); //grab # of children in database
                snapshot.forEach(function(childSnapshot) { //for each child in database...
                    var popularSearchItem = childSnapshot.val(); //grab value
                    popularSearchesArray.push(popularSearchItem); //push each child to array
                    console.log(popularSearchesArray);
                    var apiKeyH = "AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU";
                    var urlH = "https://maps.googleapis.com/maps/api/geocode/json";
                    urlH = urlH + "?" + $.param({
                        'address': childSnapshot.val().userAddress,
                        'key': apiKeyH
                    });
//ORGANIZE INTO FUNCTIONS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    $.ajax({
                        url: urlH,
                        method: "GET"
                    }).then
                        (function(results) {                
                            var popularLat = results.results[0].geometry.location.lat;
                            var popularLong = results.results[0].geometry.location.lng;
                            var popularLatString = popularLat.toString();
                            var popularLongString = popularLong.toString();
                            var popularLatLong = popularLatString + "," + popularLongString;
                            //console.log(latLongArray.length) //GENERATES ARRAY FOR EACH INDIVIDUAL ENTRY JUST WITH THAT ENTRY SO LENGTH IS 1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                           //ANOTHER YOUTUBE AJAX CALL!
                            var apiKeyZ = "AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";
                            var urlZ = "https://www.googleapis.com/youtube/v3/search";
                            urlZ += "?" + $.param({
                                'type': 'video',
                                'maxResults': 1,
                                'part': 'snippet',
                                'videoEmbeddable': true,
                                'location': popularLatLong,
                                'locationRadius': '10mi',
                                'key': apiKeyZ,
                                'chart': 'mostPopular'
                            });
                        
                            $.ajax({
                                url: urlZ,
                                method: "GET"
                            }).then (function(response) { //push thumbnail to page
                                    $("#recent-searches").empty();
                                    var popularThumbnailPath = response.items[0].snippet.thumbnails.default.url;
                                    var popularThumbnail = $("<img class='popular-thumbnail'>");
                                    popularThumbnail.attr("src", popularThumbnailPath);
                                    //console.log(popularThumbnailPath);
                                    //$("#popular-results").append(popularThumbnail);
                                    popularThumbnailArray.push(popularThumbnail);
                                    var numChildren = popularSearchesArray.length;
                                    console.log(numChildren); //works but doing x times for each location (x = # of children!!!!!!!!!!!!!!!1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                        if (numChildren < 6) {
                                            $("#recent-searches").html(popularThumbnailArray); //push updated contents of array to page
                                        } else if (numChildren >= 6) {
                                            popularThumbnailArray.shift();
                                            $("#recent-searches").html(popularThumbnailArray); //push updated contents of array to page
                                        }
                                }); //it's appending the array multiple times!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! once 
                            });
                        });
                    });
                });
            });
        });
    });


/*
    
snapshot.forEach(function(childSnapshot) {
           
*/
