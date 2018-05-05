$(document).ready(function() {

    /////////////////////////////////////////////////////BIG VARIABLES/////////////////////////////////////////////////////
    
        var userThumbnailArray = [];
        var userThumbnailPath;
        var popularThumbnailArray = [];
        var popularThumbnailPath;
        var userAddress = "";
        var urlGoogle = "https://maps.googleapis.com/maps/api/geocode/json";
        var apiKeyGoogle = "AIzaSyCXz3ctOfdCYgcEHTokEyM5Dso_kiMJDeY";
        var urlYoutube = "https://www.googleapis.com/youtube/v3/search";
        var apiKeyYoutube = "AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";
    
    /////////////////////////////////////////////////////FIREBASE/////////////////////////////////////////////////////
    
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
    
    ///////////////////////////////////////////////GLOBAL FUNCTIONS/////////////////////////////////////////////////////
    
    function mapsAjax(address, urlGoogle) {
        return new Promise(function(resolve, reject) {
            if (geocoder) {
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var lat = results[0].geometry.location.lat();
                        var lng = results[0].geometry.location.lng();
                        resolve({
                            lat: lat,
                            lng: lng
                        });
                    }
                    else {
                        reject("Geocoding failed: " + status);
                    }
                });
            } else {
                reject('no geocoder');
            }
        });
    };

//        return $.ajax({
//            url: urlGoogle,
//            method: "GET"
//        })
    
    function youtubeAjax(urlYoutube) {
        return $.ajax({
            url: urlYoutube,
            method: "GET"
        })
    };
    
    var geocoder = new google.maps.Geocoder();
    
    ////////////////ANYTIME A NEW ITEM IS ADDED TO THE DATABASE, AND ON LOAD////////////////
    
    database.ref().on("child_added", function(snapshot) {
    
    //for each item in database...
    //grab lat/long
    //grab thumbnail
    //push to array
    //print updated array to page
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function loadFromDatabase(snapshot) {

//            $("#recent-searches").empty();
            snapshot.forEach(function(childSnapshot) { //for each child in database...
                var popularSearchItem = childSnapshot.val(); //grab value
                //console.log(popularSearchItem)
                
                var newMapsURL = urlGoogle;
                newMapsURL += "?" + $.param({ //convert each location in database to lat/long; modify URL lookup for each item in database
                    'address': popularSearchItem,
                    'key': apiKeyGoogle
                });
                //console.log("urlGoogle: ",urlGoogle);
    
                mapsAjax(popularSearchItem, newMapsURL) //call to google maps API to grab data for each item in database
                .then (function(results) {
                    var lat = results.lat;
                    var long = results.lng;
                    //console.log(lat + "," + long) //correct
                    
                    var newYoutubeURL = urlYoutube;
                    newYoutubeURL += "?" + $.param({ //modify youtube API url for each location item in database
                        'type': 'video',
                        'maxResults': 10,
                        'part': 'snippet',
                        'videoEmbeddable': true,
                        'location': lat + "," + long,
                        'locationRadius': '10mi',
                        'key': apiKeyYoutube,
                        'chart': 'mostPopular'
                    })
                    //console.log(newYoutubeURL) //correct
                    youtubeAjax(newYoutubeURL) //call to youtube api to grab data for each item in database
                    .then (function(response) {
                        popularThumbnailPath = response.items[0].snippet.thumbnails.default.url;
                        console.log(popularThumbnailPath);
                        var popularThumbnailId = response.items[0].id.videoId;
                        console.log(popularThumbnailId);
                        var popularThumbnailDiv = $('<div id="'+popularSearchItem+'"</div>'); //each thumbnail has its own div called location name
                        var popularThumbnail = $("<img>");
                        $("#"+popularSearchItem).append(popularThumbnail);
                        console.log(popularSearchItem);
                        popularThumbnail.attr("src", popularThumbnailPath); //assign src for thumbnail img
                        $("#"+popularSearchItem).text(popularThumbnailId); //append each thumbnail's ID to its corresponding image div
                        $("#"+popularSearchItem).append(popularSearchItem); //append each thumbnail's location to its div
                        //console.log(popularThumbnail);
                        //console.log(popularSearchItem);
                        popularThumbnailArray.push(popularThumbnail); //push thumbnail to array
                        console.log(popularThumbnailDiv);
                        if (popularThumbnailArray.length >= 6) {
                            popularThumbnailArray.shift(); ///////////////////////////////////////////////////////
                            $("#recent-searches").html(popularThumbnailArray)
                        }
                        else {
                            $("#recent-searches").html(popularThumbnailArray); //push updated contents of thumbnail array to page
                        }

                        //console.log(popularThumbnailArray)
                        
                        
                    })
                })
            })
        }
    
        loadFromDatabase(snapshot);

    });

    
    
    ////////////////ON SEARCH BUTTON CLICK...////////////////

    
    $("#search-button").on("click", function() {
        userThumbnailArray = [];
        $("#user-results").empty();
        userAddress = $("#search-field").val().trim();
        event.preventDefault();
    
        function saveSearch() {
            database.ref().push({
                userAddress: userAddress, //save each new location entered by user to database
            });
    
            urlGoogle += "?" + $.param({  //modify URL grab data for that location
                'address': userAddress,
                'key': apiKeyGoogle
            });
    
            mapsAjax(userAddress, urlGoogle) //convert location to lat/long

            .then (function(results) {
                var lat = results.lat;
                var long = results.lng;
                urlYoutube += "?" + $.param({ 
                    'type': 'video',
                    'maxResults': 5,
                    'part': 'snippet',
                    'videoEmbeddable': true,
                    'location': lat + "," + long,
                    'locationRadius': '10mi',
                    'key': apiKeyYoutube, //grab youtube thumbnail based on lat/long
                    'chart': 'mostPopular'
                });

                youtubeAjax(urlYoutube)
                .then (function(response) {
                    $("#user-results").empty();

                    for (var i=0; i<5; i++) { //push 5 video thumbnails pertaining to user's searched location to page
                        var userThumbnailPath = response.items[i].snippet.thumbnails.default.url;
                        var userThumbnail = $("<img class='user-thumbnail'>");
                        userThumbnail.attr("src", userThumbnailPath);
                        userThumbnailArray.push(userThumbnail);
                        console.log(response.items[i]);                        
                        }

                        $("#user-results").append(userThumbnailArray);
                });
            });
        };
        saveSearch();
    }); 
    })


    /////// ON LOAD, PUSHES CORRECT THUMBNAILS FROM SEARCHES TO PAGE ///////
    ////// ON CLICK OF 'SUBMIT', GRABS SAME THUMBNAIL MULTIPLE TIMES  //////


    /*

    log coordinates instead of location?

set to id of youtube video
what's being added to array for a given id or place

each line: id and what was entered for search, to figure out what's being added (if same thumbnail, from same lat/long or different?)

communicate with team
if still can't figure out, tell dexter

    */