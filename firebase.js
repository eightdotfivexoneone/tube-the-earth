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

// Initial values
var userAddress = "";

$("#search-button").on("click", function() {
    userAddress = $("#search-field").val().trim();
    console.log("hi there");
    database.ref().push({
        userAddress: userAddress
    });
    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val().userAddress);
        console.log("hello");
        var userLocation = childSnapshot.val().userAddress;
    });

});