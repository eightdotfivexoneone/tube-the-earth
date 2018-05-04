$(document).ready(function() {

/////////////////////////////////////////////////////BIG VARIABLES/////////////////////////////////////////////////////

    var userThumbnailArray = [];
    var userThumbnailPath;
    var userSearchesArray = [];
    var popularThumbnailArray = [];
    var popularThumbnailPath;
    var popularSearchesArray = [];
    var userAddress = $("#search-field").val().trim(); //or blank?????????

/////////////////////////////////////////////////////FIREBASE/////////////////////////////////////////////////////

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


/////////////////////////////////////////////////////GLOBAL FUNCTIONS/////////////////////////////////////////////////////

function mapsAjax() {
    var apiKeyGoogle = "AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU";
    var urlGoogle = "https://maps.googleapis.com/maps/api/geocode/json";
    return $.ajax({
        url: urlGoogle,
        method: "GET"
    })
}

function youtubeAjax() {
    var apiKeyYoutube = "AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";
    var urlYoutube = "https://www.googleapis.com/youtube/v3/search";
    return $.ajax({
        url: urlYoutube,
        method: "GET"
    })
}

////////////////ON LOAD...////////////////

function loadFromDatabase(snapshot) { //get items from database, grab thumbnails for those items, push each item to array, & push array to page
    console.log(childSnapshot)
    snapshot.forEach(function(childSnapshot) { //for each child in database...  DOESN'T RECOGNIZE SNAPSHOT!!!!!!!!!!!!!!!!!!!!!!!!
        var popularSearchItem = childSnapshot.val(); //grab value
        popularSearchesArray.push(popularSearchItem); //push each child's value to array (for locations saved to database)
        
        urlGoogle += "?" + $.param({ //convert each location in database to lat/long; modify URL for each location item in database
            'address': popularSearchItem,
            'key': apiKeyGoogle
        });
        mapsAjax(urlGoogle)
        .then (function(results){
            var lat = results.results[0].geometry.location.lat;
            var long = results.results[0].geometry.location.lng;
            urlYoutube += "?" + $.param({ //modify youtube API url for each location item in database
                'type': 'video',
                'maxResults': 1,
                'part': 'snippet',
                'videoEmbeddable': true,
                'location': lat + "," + long,
                'locationRadius': '10mi',
                'key': apiKeyYoutube,
                'chart': 'mostPopular'
            })
            youtubeAjax(urlYoutube) //ajax call to grab api data for each item in database   NEED SRC/IMG TAG 
            .then (function(response) {

                popularThumbnailPath = response.items[0].snippet.thumbnails.default.url;
                var popularThumbnail = $("<img class='popular-thumbnail'>");
                popularThumbnail.attr("src", popularThumbnailPath);
                popularThumbnailArray.push(popularThumbnail);
                if (popularThumbnailArray.length >= 6) {
                    popularThumbnailArray.shift();
                }
                $("#recent-searches").html(popularThumbnailArray); //push updated contents of array to page
            })
        
        })
    })
}

loadFromDatabase();



////////////////ANYTIME A NEW ITEM IS ADDED TO THE DATABASE...////////////////
database.ref().on("child_added", function(snapshot, childSnapshot) {
    popularSearchesArray.push(childSnapshot.val().userAddress); //push item to array
    //NEED TO GET LAT/LONG AND THUMBNAIL, THEN PUSH TO THUMBNAIL ARRAY!!!!
    $("#recent-searches").html(popularThumbnailArray);//push updated array to page
    //NEED TO PUSH ARRAY OF THUMBNAILS, NOT LOCATIONS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
});




////////////////ON SEARCH BUTTON CLICK...////////////////
$("#search-button").on("click", function() {
    event.preventDefault();
    function saveSearch() {
    database.ref().push({
        userAddress: userAddress, //save each new location entered by user to database
    });
    //popularThumbnailArray.push(userAddress); //add to WHICH array?????????????????????????????

    urlGoogle += "?" + $.param({ //convert each location in database to lat/long; modify URL for each location item in database
        'address': userAddress,
        'key': apiKeyGoogle
    });
    mapsAjax(urlGoogle)
    .then (function(results){
        var lat = results.results[0].geometry.location.lat; //grab lat/long for user's entry
        var long = results.results[0].geometry.location.lng;
    
        urlYoutube += "?" + $.param({ //modify paramaters based on user's location entry
            'type': 'video',
            'maxResults': 5,
            'part': 'snippet',
            'videoEmbeddable': true,
            'location': lat + "," + long,
            'locationRadius': '10mi',
            'key': apiKeyY,
            'chart': 'mostPopular'
        });
        youtubeAjax(urlYoutube); //grab youtube data specific to that location

        for (var i=0; i<5; i++) { //push 5 video thumbnails pertaining to user's searched location to page
                var userThumbnailPath = response.items[i].snippet.thumbnails.default.url;
                var userThumbnail = $("<img class='user-thumbnail'>").attr("src", userThumbnailPath);
                $("#user-results").append(userThumbnail);
            }
        });
    }
})
})



    //userThumnailArray
        //NEED THUMBNAILS, then push to array
//   $("#recent-searches").html(popularThumbnailArray); //print new version of array
    


    //load 5 video thumbnails for that search (to replace ones from last search)
    //save search to database and add to array



/*
//function getLatestSearches() {
  //  var variable = foo;
    
    //retrieve latest from db
    //return $.ajax({
      //  url: urlGoogle,
        //method: "GET"
   // })
}

function getVideos() {
    //get thumbnails from previous searches from db
}



        getLatestSearches()
            .then()

    */