$(document).ready(function() {

var longi;
var lati;

var geocoder = new google.maps.Geocoder();
var urlGoogle = "https://maps.googleapis.com/maps/api/geocode/json";
var urlYoutube = "https://www.googleapis.com/youtube/v3/search";
var apiKeyYoutube = "AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";
var userAddress = "";

/*
var userThumbnailArray = [];
    var userThumbnailPath;
    var popularThumbnailArray = [];
    var popularThumbnailPath;
    var userAddress = "";
    var apiKeyGoogle = "AIzaSyCXz3ctOfdCYgcEHTokEyM5Dso_kiMJDeY";
    var urlYoutube = "https://www.googleapis.com/youtube/v3/search";
    var apiKeyYoutube = "AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";
*/

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
    }

function youtubeAjax(urlYoutube) {
    return $.ajax({
        url: urlYoutube,
        method: "GET"
    })
}

database.ref().on("child_added", function(snapshot) { //on page load, and when new child added...
        function loadFromDatabase(snapshot) {
            snapshot.forEach(function(childSnapshot) { //for each child in database...
                var popularSearchItem = childSnapshot.val(); //grab value
                console.log(popularSearchItem) //this is correct
                var newMapsURL = urlGoogle;
                newMapsURL += "?" + $.param({ //convert each location in database to lat/long; modify URL lookup for each item in database
                    'address': popularSearchItem,
                    'key': apiKeyGoogle
                });   
                mapsAjax(popularSearchItem, newMapsURL) //call to google maps API to grab data for each item in database
                .then (function(results) {
                    var lat = results.lat;
                    var long = results.lng;
                    console.log(lat + "," + long) //this is correct
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
                    console.log(urlYoutube) //this is correct
                    youtubeAjax(urlYoutube) //call to youtube api to grab data for each item in database
                    
                    .then (function(response) {
                        console.log(response)
                        popularThumbnailPath = response.items[0].snippet.thumbnails.default.url;
                        console.log(popularThumbnailPath)
                        var popularThumbnail = $("<img class='popular-thumbnail'>");
                        popularThumbnail.attr("src", popularThumbnailPath); //assign src for thumbnail img
                        console.log(popularThumbnail)
                        popularThumbnailArray.push(popularThumbnail); //push thumbnail to array
                        if (popularThumbnailArray.length >= 6) {
                            //popularThumbnailArray.shift(); ///////////////////////////////////////////////////////
                            $("#recent-searches").html(popularThumbnailArray)
                        }
                        else {
                            $("#recent-searches").html(popularThumbnailArray); //push updated contents of thumbnail array to page
                        }

           
        });
    });
});


      function initMap() {
        
        var map = new google.maps.Map(document.getElementById('map-section'), {
          zoom: 8,
          center: {lat: 43.07167, lng: -70.76236}
        });

        var geocoder = new google.maps.Geocoder();
        console.log(map.center);
        google.maps.event.addListener(map, 'click', function(event) {
          placeMarker(event.latLng);
        });

        function placeMarker(location) {
            if (marker == undefined){
                marker = new google.maps.Marker({
                    position: location,
                    map: map, 
                    animation: google.maps.Animation.DROP,
                });
            }
            else{
                marker.setPosition(location);
            }
            map.setCenter(location);
            console.log(location.lat());//this is where latitude is being console logged
            console.log(location.lng());//longitude
        }

        document.getElementById('submit').addEventListener('click', function() { //when submit button pressed (twice)...
          geocodeAddress(geocoder, map);
          console.log(geocoder);
          console.log(map);
          console.log(map.center.lat());
          console.log(map.center.lng());
          longi = map.center.lng();
          lati = map.center.lat();
          //debugger;
          // var latitude = $("#lat").val().trim();
          // var longitude = $("#long").val().trim();
          var radius = $("#rad").val().trim();
          var queryURL = "https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&location=" + lati + "," + longi + "&locationRadius=" + radius + "miles&key=AIzaSyC3hyycsztOR8N1flGac1ocYQF1PGt6F6M";
          console.log(lati);
          console.log(longi); //grab data from youtube api
          $.ajax({
          url: queryURL,
          method: "GET"
          })
          
          .then(function(response) { //then...
            var results = response.data;
            console.log(response);
            console.log(response.pageInfo.totalResults);
            if (response.pageInfo.totalResults !== 0) {
              for (var i = 0; i < response.items.length; i++) { //circle through youtube response items             

                console.log(response);
                console.log(response.items[i].id.videoId);
                
                $("#cardThumb" + i).html("<iframe width='100%' src='https://www.youtube.com/embed/" + response.items[i].id.videoId + "' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>");
                $("#youtubeLink" + [i]).html("<a href='https://www.youtube.com/watch?v=" + response.items[i].id.videoId + "' class='btn btn-danger' target='_blank'>" + response.items[i].snippet.channelTitle + "</a>");
                // $("#youtubeTitle" + [i]).html(response.items[i].snippet.title);
              }

              $("#videoIframe").html("<iframe width='100%' src='https://www.youtube.com/embed/" + response.items[0].id.videoId + "' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>");
            } else {
                alert("no results!");
              };
            });
          });
      };
      
      console.log(longi);
        
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
            // alert('Geocode was not successful for the following reason: ' + status);
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
      };

      $("#history").on("click", function() {
        $("#additionalDiv").css("display", "none")
        $("#historyDiv").css("display", "block")
      });
      $("#recently").on("click", function() {
          $("#historyDiv").css("display", "none")
          $("#additionalDiv").css("display", "block")
      });
    });
})