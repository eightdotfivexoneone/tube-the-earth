// JS for Tube The Earth

$(document).ready(function() {

const section = document.getElementById("map-section");

var searchTerm = "03801";

// section.innerHTML =`
//     <iframe class="map" width="100%" height="100%" frameborder="0" style="border:0"
//     src="https://www.google.com/maps/embed/v1/search?key=AIzaSyBRjbBXmBByR-YaGaOMs7PAwS4SBmGIqzw&q=${searchTerm}" allowfullscreen>
//     </iframe>`

// assign variable to output

// // put listener on button and when clicked do the function
// $('#btn-search').on('click', renderMap(locationMap));

// function renderMap(locationMap){
 
// console.log("greeting from inside the function" + locationMap);

//  // clear out the map that's there
//  UIframe.innerHTML = '';
//  //the stuff we did up top

// UIframe.innerHTML =`
//     <iframe class="map" width="100%" height="100%" frameborder="0" style="border:0"
//     src="https://www.google.com/maps/embed/v1/search?key=AIzaSyBRjbBXmBByR-YaGaOMs7PAwS4SBmGIqzw&q=${locationMap}" allowfullscreen>
//     </iframe>
//                     `
// alert("here");
// // section.appendChild(UIframe);
// // e.preventDefault();
// }

// put listener on button and when clicked do the function
$('#btn-search').click(function renderMap(e) {
    e.preventDefault();
    var locationMap = $("#search-input").val();

 // clear out the map that's there
 section.innerHTML = '';
 //the stuff we did up top

 section.innerHTML =`
    <iframe class="map" width="100%" height="100%" frameborder="0" style="border:0"
    src="http://www.google.com/maps/embed/v1/search?key=AIzaSyBRjbBXmBByR-YaGaOMs7PAwS4SBmGIqzw&q=${locationMap}"allowfullscreen>
    </iframe>`
});

/////////////////////////////////////////jess's code///////////////
////////////
var longi;
var lati;

// function initMap() {

// var map = new google.maps.Map(document.getElementById("map-section"), {
// zoom: 8,
// center: {lat: -34.397, lng: 150.644}
// });
// var geocoder = new google.maps.Geocoder();
// console.log(map.center);
// google.maps.event.addListener(map, 'click', function(event) {
// placeMarker(event.latLng);
// });
// function placeMarker(location) {
// if (marker == undefined){
// marker = new google.maps.Marker({
// position: location,
// map: map, 
// animation: google.maps.Animation.DROP,
// });
// }
// else{
// marker.setPosition(location);
// }
// map.setCenter(location);
// console.log(location.lat());//this is where latitude is being console logged
// console.log(location.lng());//longitude
// }
// document.getElementById('submit').addEventListener('click', function() {
// geocodeAddress(geocoder, map);
// console.log(geocoder);
// console.log(map);
// console.log(map.center.lat());
// console.log(map.center.lng());
// longi = map.center.lng();
// lati = map.center.lat();
// //debugger;

// });

// }
// initMap();

// console.log(longi);

function geocodeAddress(geocoder, resultsMap) {
var address = document.getElementById('address').value;
geocoder.geocode({'address': address}, function(results, status) {
if (status === 'OK') {
resultsMap.setCenter(results[0].geometry.location);
var marker = new google.maps.Marker({
map: resultsMap,
position: results[0].geometry.location
});
} else {
alert('Geocode was not successful for the following reason: ' + status);
}
console.log(address);
console.log(results[0].geometry.location.lat());
console.log(results[0].geometry.location.lng());
});
}
var marker;
function initialize() {
var latlng = new google.maps.LatLng(42.55308, 9.140625);
var myOptions = {
zoom: 2,
center: latlng,
mapTypeId: google.maps.MapTypeId.ROADMAP,
streetViewControl: false,
mapTypeControl: false,
};
var map = new google.maps.Map(document.getElementById("map_canvas"),
myOptions);
}

// Matt's code
$("#history").on("click", function() {
    $("#additionalDiv").css("display", "none")
    $("#historyDiv").css("display", "block")
});
$("#recently").on("click", function() {
    $("#historyDiv").css("display", "none")
    $("#additionalDiv").css("display", "block")
});

$("#btn-temp").on("click", function() {
   var latitude = $("#lat").val().trim();
   var longitude = $("#long").val().trim();
   var radius = $("#rad").val().trim();
   var queryURL = "https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&location=" + latitude + "," + longitude + "&locationRadius=" + radius + "miles&key=AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";

   $.ajax({
   url: queryURL,
   method: "GET"
   })
   
   .then(function(response) {
     var results = response.data;
     console.log(response);
     console.log(response.pageInfo.totalResults);
     if (response.pageInfo.totalResults !== 0) {
       for (var i = 0; i < response.items.length; i++) {             

         console.log(response);
         console.log(response.items[i].id.videoId);
         
         $("#cardThumb" + [i]).html("<img class='card-img-top' src=" + response.items[i].snippet.thumbnails.high.url + "> ");
         $("#youtubeLink" + [i]).html("<a href='https://www.youtube.com/watch?v=" + response.items[i].id.videoId + "' class='btn btn-danger'>" + response.items[i].snippet.channelTitle + "</a>");
         $("#youtubeTitle" + [i]).html(response.items[i].snippet.title);
         $("#videoIframe").html("<iframe width='100%' src='https://www.youtube.com/embed/" + response.items[0].id.videoId + "' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>");
       }
     } else {
         alert("no results!");
       };
     });
   });

////////////////////////// GOOGLE MAPS GEOCODING API DATA /////////////////////////////////
//to convert location user enters to lat/long

//https://maps.googleapis.com/maps/api/geocode/json?address=Croatia&key=AIzaSyC38jvNaBiOYkmKPDHFXLYcOpdcJIqJ7PU


var userAddress = "";
var childrenArray = [];

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



          //when data in database changes...
          database.ref().on("child_added", function(childSnapshot) { //each time another search is added to database...
            console.log("before push childrenArray",childrenArray.join(', '))
            childrenArray.push(childSnapshot.val().userAddress); //push the new location the user entered to childrenArray
            console.log("after push childrenArray",childrenArray.join(', '))
            var numChildren = childrenArray.length; //increment # of children by one
            if (numChildren < 5) { //if there are fewer than 5 children in database...
                $("#recent-searches").html(childrenArray.join(', ')); //push updated contents of childrenArray to page
            } else if (numChildren >= 5) {//otherwise, if there are 5+ children in database...  //NOT WORKING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                console.log("numchildren >= 5 childrenArray:",childrenArray.join(', '))
                childrenArray.splice(0, 1, childSnapshot.val().userAddress); //replace oldest item in childrenArray with newest one
                console.log("after splice childrenArray",childrenArray.join(', '))
                $("#recent-searches").html(childrenArray.join(', ')); //push updated contents of childrenArray to page
            }
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
        var long = results.results[0].geometry.location.lng; //necessary to parse??

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
    }).then (function(results) {
        $("#popular").empty();
        for (i=0; i<5; i++) { //pushing 5 location-specific video thumbnails to page
            var thumbnailPath = results.items[i].snippet.thumbnails.default.url;
            var thumbnail = $("<img class='thumbnail'>").attr("src", thumbnailPath);
            $("#popular").append(thumbnail);
        }
        });
    });
        

  
    });
});