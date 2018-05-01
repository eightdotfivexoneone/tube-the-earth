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
var numChildren = 0;
var childrenArray = [];

$(document).ready(function() {
$("#search-button").on("click", function() {
    event.preventDefault();
    userAddress = $("#search-field").val().trim();
    database.ref().push({
        userAddress: userAddress, //add jesse's var for location
    });
});

//set firebase vars as parameters in function, no need to define outside of it
//functions for all firebase operations and then call from app.js

database.ref().on("child_added", function(childSnapshot) { //each time child is added to database...
    numChildren++; //increment # of children by one
    childrenArray.push(childSnapshot.val().userAddress); //push the new location the user entered to childrenArray
    if (numChildren < 5) { //if there are fewer than 5 children in database...
        $("#popular").append(childSnapshot.val().userAddress + ", ") //push user's location search to page
    } else {//otherwise, if there are 5+ children in database...  //NOT WORKING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        childrenArray.splice(0, 1, childSnapshot.val().userAddress); //replace oldest item in childrenArray with newest one
        $("#popular").html(childrenArray.join(', ')); //push updated contents of childrenArray to page
    }
    //console.log(childrenArray)
    //console.log(numChildren);
});

});

//       $(childrenArray[0]).replaceWith(childSnapshot.val().userAddress);
//GET VIDEO THUMBNAIL IMG TO STAY ON PAGE UPON REFRESH -- look into json.parse
//SO JUST DO THE SAME THING BUT WITH VIDEO THUMBNAILS INSTEAD OF THEIR SEARCH TERMS