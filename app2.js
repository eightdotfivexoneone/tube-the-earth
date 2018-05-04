$(document).ready(function() {

/////////////////////////////////////////////////////BIG VARIABLES/////////////////////////////////////////////////////

    var userThumbnailArray = [];
    var userThumbnailPath;
    var userSearchesArray = [];
    var popularThumbnailArray = [];
    var popularThumbnailPath;
    var popularSearchesArray = [];
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

function mapsAjax(urlGoogle) {
    //var apiKeyGoogle = "AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU";
    //var urlGoogle = "https://maps.googleapis.com/maps/api/geocode/json";
    return $.ajax({
        url: urlGoogle,
        method: "GET"
    })
}

function youtubeAjax(urlYoutube) {
    //var apiKeyYoutube = "AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";
    //var urlYoutube = "https://www.googleapis.com/youtube/v3/search";
    return $.ajax({
        url: urlYoutube,
        method: "GET"
    })
}

var geocoder = new google.maps.Geocoder();

////////////////ANYTIME A NEW ITEM IS ADDED TO THE DATABASE, AND ON LOAD////////////////

database.ref().on("child_added", function(snapshot) {

//for each item in database...
//grab lat/long
//grab thumbnail
//push to array
//print updated array to page


    function loadFromDatabase(snapshot) {
        snapshot.forEach(function(childSnapshot) { //for each child in database...
            var popularSearchItem = childSnapshot.val(); //grab value
            //console.log(popularSearchItem)
            popularSearchesArray.push(popularSearchItem); //push each child's value to array)

            var address = popularSearchItem;

            if (geocoder) {
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log("lat: ",results[0].geometry.location.lat());
                        console.log("lng: ",results[0].geometry.location.lng());
                    }
                    else {
                        console.log("Geocoding failed: " + status);
                    }
                });
            }   

            var newMapsURL = urlGoogle;
            newMapsURL += "?" + $.param({ //convert each location in database to lat/long; modify URL lookup for each item in database
                'address': popularSearchItem,
                'key': apiKeyGoogle
            });
            //console.log("urlGoogle: ",urlGoogle);

            mapsAjax(newMapsURL) //call to google maps API to grab data for each item in database
            .then (function(results) {
                //console.log(results)
                var lat = results.results[0].geometry.location.lat;
                var long = results.results[0].geometry.location.lng;
                
                var newYoutubeURL = urlYoutube;
                newYoutubeURL += "?" + $.param({ //modify youtube API url for each location item in database
                    'type': 'video',
                    'maxResults': 1,
                    'part': 'snippet',
                    'videoEmbeddable': true,
                    'location': lat + "," + long,
                    'locationRadius': '10mi',
                    'key': apiKeyYoutube,
                    'chart': 'mostPopular'
                })
                youtubeAjax(newYoutubeURL) //call to youtube api to grab data for each item in database
                .then (function(response) {
    
                    popularThumbnailPath = response.items[0].snippet.thumbnails.default.url;
                    var popularThumbnail = $("<img class='popular-thumbnail'>");
                    popularThumbnail.attr("src", popularThumbnailPath); //assign src for thumbnail img
                    popularThumbnailArray.push(popularThumbnail); //push thumbnail to array
                    if (popularThumbnailArray.length >= 6) {
                        popularThumbnailArray.shift();
                    }
                    $("#recent-searches").html(popularThumbnailArray); //push updated contents of thumbnail array to page
                })
            
            })
        })

    }

    loadFromDatabase(snapshot);        
        
/*    popularSearchesArray.push(childSnapshot.val().userAddress); //push item to array
    //NEED TO GET LAT/LONG AND THUMBNAIL, THEN PUSH TO THUMBNAIL ARRAY!!!!
    $("#recent-searches").html(popularThumbnailArray);//push updated array to page
    //NEED TO PUSH ARRAY OF THUMBNAILS, NOT LOCATIONS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
});


////////////////ON SEARCH BUTTON CLICK...////////////////

$("#search-button").on("click", function() {
    userAddress = $("#search-field").val().trim();
    event.preventDefault();

    function saveSearch() {
        database.ref().push({
            userAddress: userAddress, //save each new location entered by user to database
        });

        urlGoogle += "?" + $.param({ 
            'address': userAddress,
            'key': apiKeyGoogle
        });

        mapsAjax(urlGoogle) //convert each location in database to lat/long; modify URL for each location item in database
        .then (function(results) {
            var lat = results.results[0].geometry.location.lat; //grab lat/long for user's entry
            var long = results.results[0].geometry.location.lng;
        
            urlYoutube += "?" + $.param({ //modify paramaters based on user's location entry
                'type': 'video',
                'maxResults': 5,
                'part': 'snippet',
                'videoEmbeddable': true,
                'location': lat + "," + long,
                'locationRadius': '10mi',
                'key': apiKeyYoutube,
                'chart': 'mostPopular'
            });
            youtubeAjax(urlYoutube)
            .then (function(response) { //grab youtube data specific to that location
//console.log(response.items[0].snippet.thumbnails.default.url)
                for (var i=0; i<5; i++) { //push 5 video thumbnails pertaining to user's searched location to page
                        var userThumbnailPath = response.items[i].snippet.thumbnails.default.url;
                        var userThumbnail = $("<img class='user-thumbnail'>").attr("src", userThumbnailPath);
                        $("#user-results").append(userThumbnail);
                    }
            });
        });
    }
    saveSearch();
}); 
})