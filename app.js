////////////////////////// GOOGLE MAPS GEOCODING API DATA /////////////////////////////////
//to convert location user enters to lat/long

//https://maps.googleapis.com/maps/api/geocode/json?address=Croatia&key=AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU

var userAddress = "";
var childrenArray = [];
var thumbnail;

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
        
        //CAN I CREATE A NEW ARRAY HERE TO HOLD THE LATEST 5 CHILDREN IN THE DATABASE??
        //GRAB LOCATIONS FROM DATABASE (ALREADY DOING THAT BEFORE)
        //MUST THEN CONVERT TO LAT/LONG
        //DO I NEED 2 MORE AJAX CALLS FOR THIS??????????????????????????????????????????????????????

        var popularSearchesArray = [];
        var query = firebase.database().ref().orderByKey(); //grabbing data from firebase
        query.once("value")
            .then(function(snapshot, childSnapshot) {
              
              
              
              
                snapshot.forEach(function(childSnapshot) { //for each child in database...
                    var popularSearchItem = childSnapshot.val(); //grab value
                    var length = snapshot.numChildren(); //grab # of children in database JUST SNAPSHOT????????????????????????
                    popularSearchesArray.push(popularSearchItem); //push each child to array

//JSON PARSE EACH CHILD SNAPSHOT LOCATION????




                var apiKeyH = "AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU";
                var urlH = "https://maps.googleapis.com/maps/api/geocode/json";
                urlH = urlH + "?" + $.param({
                    'address': childSnapshot.val(),//??????????????????? I WANT DATA FROM DATABASE, NOT FROM USER'S SEARCH!!!!!!!!!!!!!!!!!!!!!!!!!!!! BUT DON'T WANT *ALL* ADDRESSES, JUST WANT ONE AT A TIME!!!!!!!!!!!!!!!!!!!!!!!
                    'key': apiKeyH
                });


                $.ajax({
                    url: urlH,
                    method: "GET"
                }).then
                    (function(results) {                
                        //console.log(results);
                        var popularLat = results.results[0].geometry.location.lat;
                        var popularLong = results.results[0].geometry.location.lng;
                            var popularLatString = popularLat.toString();
                            var popularLongString = popularLong.toString();
                            var latLongArray = [];
                            var popularLatLong = popularLatString + "," + popularLongString;                             
                        });
                        //NOW ANOTHER YOUTUBE AJAX CALL????????????????????????????? BUT HOW GET LAT/LONG THERE??????????????????????????
                  //console.log(popularSearchesArray.length);
//                        for (var x=0; x<popularSearchesArray.length; x++) {
                    //for each search item in database, convert to lat/long pair

                   //var popularLat = ;
                    //var popularLong = ;
                    //latLongArray.push(___);

                    });


                //push thumbnail
                var numChildren = popularSearchesArray.length;
                if (numChildren < 6) {
                    $("#recent-searches").html(childrenArray.join(', ')); //push updated contents of childrenArray to page
                } else if (numChildren >= 6) {
                    childrenArray.shift();
                    $("#recent-searches").html(childrenArray.join(', ')); //push updated contents of childrenArray to page
                }
        
            });
            //console.log("this works");
        });


//results.results[0].geometry.location.lat

/*
        $("#popular-results").empty();
        for (var x=0; x<5; x++) { //pushing video thumbnail to page for each item already in array
            var popularThumbnailPath = results.items[0].snippet.thumbnails.default.url;
            var popularThumbnail = $("<img class='popular-thumbnail'>").attr("src", popularThumbnailPath);
            $("#popular-results").append(popularThumbnail);
        }
  
*/

    });
        });
    });


    /*
    https://maps.googleapis.com/maps/api/geocode/json?address%5B-LBbslOsDqarhYO3C8B8%5D%5BuserAddress%5D=asia&address%5B-LBbstzKOau4rwXXsu6X%5D%5BuserAddress%5D=oregon&address%5B-LBbsxfWEjHsnbRCcASN%5D%5BuserAddress%5D=arkansas&address%5B-LBbtkbQknMy_WdypQAY%5D%5BuserAddress%5D=alabama&address%5B-LBbtriZoevJAE_v6HTE%5D%5BuserAddress%5D=alaska&key=AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU
    */