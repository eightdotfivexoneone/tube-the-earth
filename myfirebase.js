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
//console.log(database);

// Initial values
var userAddress = "";
var userLocationSearch = "";
$(document).ready(function() {
$("#search-button").on("click", function() {
    userAddress = $("#search-field").val().trim();
    database.ref().push({
        userAddress: userAddress, //add jesse's var for location
        userLocationSearch: userAddress //storing this data to firebase
    });
    database.ref().on("value", function(snapshot) {
        //console.log(snapshot);
        userLocationSearch = snapshot.val().userAddress;
        //console.log(userAddress); //this isn't being added to "popular" for subsequent users
        //console.log(userLocationSearch - undefined);
        $("#popular").text(snapshot.val().userLocationSearch) //HOW TO PUSH WHAT'S IN DATABASE TO "POPULAR" FIELD????????????
        });
    }); //if < 5 items in database, push; if 10+, replace oldest item (set)!!!!!!!!!!!!!!!!!!!!!
}) //GET VIDEO THUMBNAIL IMG TO STAY ON PAGE UPON REFRESH -- look into json.parse