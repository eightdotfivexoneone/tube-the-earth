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
        var lat;
        var long;
    
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

    /*    return $.ajax({
            url: urlGoogle,
            method: "GET"
        })
    };
*/
            

        return new Promise(function(resolve, reject) {
            if (geocoder) {
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var lat = results[0].geometry.location.lat();
                        var lng = results[0].geometry.location.lng();
                        resolve({
                            lat: lat,
                            lng: lng
                        });             console.log(results[0])
                    }
                    else {
                        reject("Geocoding failed: " + status);
                    }
                });
            } else {
                reject('no geocoder');
            }
        });
    }


    
    function youtubeAjax(urlYoutube) {
        return $.ajax({
            url: urlYoutube,
            method: "GET"
        })
    };
    
    var geocoder = new google.maps.Geocoder();
    
    ////////////////ANYTIME A NEW ITEM IS ADDED TO THE DATABASE, AND ON LOAD////////////////
    
    //database.ref().orderByChild('timestamp').startAt(Date.now()).limitToLast(5).on("child_added", function(snapshot) {
    ///TRIED TO USE THE ABOVE CODE BUT IT BROKE EVERYTHING!!!!!!!!

    database.ref().on("child_added", function(snapshot) {
    
    //for each item in database...
    //grab lat/long
    //grab thumbnail
    //push to page
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function loadFromDatabase(snapshot) {

            snapshot.forEach(function(childSnapshot) { //for each child in database...
                var popularSearchItem = childSnapshot.val(); //grab value of searched location
                
                var newMapsURL = urlGoogle;
                newMapsURL += "?" + $.param({ //convert each location in database to lat/long; modify URL lookup for each item in database
                    'address': popularSearchItem,
                    'key': apiKeyGoogle
                });
                //console.log("urlGoogle: ",urlGoogle);
    
                mapsAjax(popularSearchItem, newMapsURL) //call to google maps API to grab data for each item in database
                .then (function(results) {
                    lat = results.lat;
                    long = results.lng;
                                        
                    var newYoutubeURL = urlYoutube;
                    newYoutubeURL += "?" + $.param({ //modify youtube API url for each location item in database
                        'type': 'video',
                        'maxResults': 50,
                        'part': 'snippet',
                        'videoEmbeddable': true,
                        'location': lat + "," + long,
                        'locationRadius': '10mi',
                        'key': apiKeyYoutube,
                        'chart': 'mostPopular'
                    })
                    youtubeAjax(newYoutubeURL) //call to youtube api to grab data for each item in database
                    .then (function(response) {
                        popularThumbnailPath = response.items[0].snippet.thumbnails.default.url; //location from firebase is being updated correctly, but video ID and src not changing after the second location submit after page load.
                        //console.log(response.items[0]);
                        console.log(popularThumbnailPath);
                        var popularThumbnailId = response.items[0].id.videoId;
                        console.log(popularThumbnailId);
                        var popularThumbnail = $("<img>");
                        //console.log(popularThumbnailDiv) //correct
                        console.log(popularSearchItem);
                        popularThumbnail.attr("src", popularThumbnailPath); //assign src for thumbnail img
                        $("#recent-searches").append(popularThumbnailId + "&nbsp;");
                        $("#recent-searches").append(popularSearchItem + "&nbsp;");
                        $("#recent-searches").append(lat + "," + long + "&nbsp;");
                        $("#recent-searches").append(popularThumbnail);
                        $("#recent-searches").append("<br>");
                        //if (popularThumbnailArray.length >= 6) {
                          //  popularThumbnailArray.shift(); ///////////////////////////////////////////////////////
                        //    $("#recent-searches").html(popularThumbnailArray);
                        //}
                        //else {
                          //  $("#recent-searches").html(popularThumbnailArray); //push updated contents of thumbnail array to page
                        //}
                        //console.log(popularThumbnailArray)
                        
                        
                    })
                })
            
        });
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
                lat = results.lat;
                long = results.lng;
                //lat = results.results[0].geometry.location.lat;
                //long = results.results[0].geometry.location.lng;
                urlYoutube += "?" + $.param({ 
                    'type': 'video',
                    'maxResults': 50,
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