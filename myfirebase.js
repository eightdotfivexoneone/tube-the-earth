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

database.ref().on("child_added", function(childSnapshot) { //each time child is added to database...
    numChildren++; //increment # of children by one
    childrenArray.push(childSnapshot.val().userAddress); //push the new location the user entered to childrenArray
    if (numChildren < 5) { //if there are fewer than 5 children in database...
        $("#popular").append(childSnapshot.val().userAddress + ", ") //push user's location search to page
    } else if (numChildren >= 10) { //otherwise, if there are 10+ children in database...
        $(childrenArray[0]).replaceWith(childSnapshot.val().userAddress); //replace oldest item in childrenArray with latest one
        $("#popular").html(childrenArray.join(',')); //push updated contents of childrenArray to page BUT NEED COMMAS TO SEPARATE
    }
    console.log(childrenArray)
});
    
    }); //if 10+, replace oldest item (set)!!!!!!!!!!!!!!!!!!!!!
    
    //GET VIDEO THUMBNAIL IMG TO STAY ON PAGE UPON REFRESH -- look into json.parse