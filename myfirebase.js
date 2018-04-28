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
$(document).ready(function() {
$("#search-button").on("click", function() {
    //console.log("hi there");
    userAddress = $("#search-field").val().trim();
    database.ref().set({
        userAddress: userAddress
    });
    database.ref().on("value", function(snapshot) {
        console.log(snapshot.val().userAddress);
        //console.log("hello");
        var userLocation = snapshot.val().userAddress;
        console.log(userLocation)
    });
});
})